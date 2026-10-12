const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const { sendSuccess, createError } = require('../utils/apiResponse');

/**
 * @desc    Get all students with search and pagination
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = { role: 'student' };

    if (search && search.trim()) {
      const trimmed = search.trim();
      query.$or = [
        { name: { $regex: trimmed, $options: 'i' } },
        { email: { $regex: trimmed, $options: 'i' } },
        { studentId: { $regex: trimmed, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const meta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    return sendSuccess(res, 200, 'Users retrieved successfully', users, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user with order count
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid user ID', 400));
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return next(createError('User not found', 404));
    }

    const orderCount = await Order.countDocuments({ user: id });

    return sendSuccess(res, 200, 'User retrieved successfully', {
      ...user.toObject(),
      orderCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status (activate/deactivate)
 * @route   PATCH /api/users/:id/status
 * @access  Private/Admin
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid user ID', 400));
    }

    // Prevent admin from deactivating themselves
    if (id === req.user._id.toString()) {
      return next(createError('You cannot change your own active status', 400));
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return next(createError('User not found', 404));
    }

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess(
      res,
      200,
      `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserStatus,
};
