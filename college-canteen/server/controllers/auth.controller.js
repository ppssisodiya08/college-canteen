const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, createError } = require('../utils/apiResponse');

// Helper to sign JWT
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper to set cookie and send response
const sendTokenCookie = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };

  res.cookie('token', token, cookieOptions);

  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.password;
  delete userData.__v;

  return sendSuccess(res, statusCode, message, {
    user: userData,
    token, // Also returning token in response payload for flexible client consumption
  });
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, phone } = req.body;

    if (!name || !email || !password) {
      return next(createError('Name, email, and password are required', 400));
    }

    if (password.length < 6) {
      return next(createError('Password must be at least 6 characters long', 400));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return next(createError('An account with this email already exists', 409));
    }

    // Role is ALWAYS forced to student
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      studentId: studentId ? studentId.trim() : '',
      phone: phone ? phone.trim() : '',
      role: 'student',
    });

    return sendTokenCookie(user, 201, res, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return next(createError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(createError('Your account has been deactivated. Please contact support.', 403));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError('Invalid email or password', 401));
    }

    return sendTokenCookie(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
     httpOnly: true,
     secure: true,
     sameSite: 'none',
     path: '/',
      expires: new Date(0),
    });

    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User profile fetched successfully', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name, phone, studentId)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, studentId } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (studentId !== undefined) updates.studentId = studentId.trim();

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    return sendSuccess(res, 200, 'Profile updated successfully', {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(createError('Current password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(createError('New password must be at least 6 characters long', 400));
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(createError('User not found', 404));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(createError('Incorrect current password', 400));
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
