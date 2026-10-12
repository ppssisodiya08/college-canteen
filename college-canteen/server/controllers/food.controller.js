const mongoose = require('mongoose');
const Food = require('../models/Food');
const Category = require('../models/Category');
const { sendSuccess, createError } = require('../utils/apiResponse');

/**
 * @desc    Get all foods with search, filtering, sorting, pagination
 * @route   GET /api/foods
 * @access  Public
 */
const getAllFoods = async (req, res, next) => {
  try {
    const {
      search,
      category,
      available,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search filter
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      query.$or = [
        { name: { $regex: trimmedSearch, $options: 'i' } },
        { description: { $regex: trimmedSearch, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      }
    }

    // Availability filter
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Food.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const foods = await Food.find(query)
      .populate('category', 'name')
      .sort(sortOption)
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

    return sendSuccess(res, 200, 'Foods retrieved successfully', foods, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get food by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid food ID', 400));
    }

    const food = await Food.findById(id).populate('category', 'name description');
    if (!food) {
      return next(createError('Food item not found', 404));
    }

    return sendSuccess(res, 200, 'Food item retrieved successfully', food);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new food item
 * @route   POST /api/foods
 * @access  Private/Admin
 */
const createFood = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      isAvailable,
      preparationTime,
      image: bodyImage,
    } = req.body;

    if (!name || price === undefined || !category) {
      return next(createError('Name, price, and category are required', 400));
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return next(createError('Invalid category ID', 400));
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(createError('Referenced category does not exist', 404));
    }

    let image = bodyImage || `https://placehold.co/400x300/f97316/ffffff?text=${encodeURIComponent(name.trim())}`;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const food = await Food.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      category,
      stock: stock !== undefined ? Number(stock) : 100,
      isAvailable: isAvailable !== undefined ? isAvailable === true || isAvailable === 'true' : true,
      preparationTime: preparationTime ? preparationTime.trim() : '10-15 mins',
      image,
    });

    const populatedFood = await Food.findById(food._id).populate('category', 'name');

    return sendSuccess(res, 201, 'Food item created successfully', populatedFood);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update food item
 * @route   PUT /api/foods/:id
 * @access  Private/Admin
 */
const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid food ID', 400));
    }

    const food = await Food.findById(id);
    if (!food) {
      return next(createError('Food item not found', 404));
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      isAvailable,
      preparationTime,
      image: bodyImage,
    } = req.body;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(createError('Invalid category ID', 400));
      }
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return next(createError('Referenced category does not exist', 404));
      }
      food.category = category;
    }

    if (name !== undefined) food.name = name.trim();
    if (description !== undefined) food.description = description.trim();
    if (price !== undefined) food.price = Number(price);
    if (stock !== undefined) food.stock = Number(stock);
    if (isAvailable !== undefined) {
      food.isAvailable = isAvailable === true || isAvailable === 'true';
    }
    if (preparationTime !== undefined) food.preparationTime = preparationTime.trim();

    if (req.file) {
      food.image = `/uploads/${req.file.filename}`;
    } else if (bodyImage !== undefined) {
      food.image = bodyImage;
    }

    await food.save();
    const updatedFood = await Food.findById(food._id).populate('category', 'name');

    return sendSuccess(res, 200, 'Food item updated successfully', updatedFood);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete food item
 * @route   DELETE /api/foods/:id
 * @access  Private/Admin
 */
const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid food ID', 400));
    }

    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return next(createError('Food item not found', 404));
    }

    return sendSuccess(res, 200, 'Food item deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle food availability
 * @route   PATCH /api/foods/:id/availability
 * @access  Private/Admin
 */
const toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid food ID', 400));
    }

    const food = await Food.findById(id);
    if (!food) {
      return next(createError('Food item not found', 404));
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    return sendSuccess(
      res,
      200,
      `Food availability changed to ${food.isAvailable ? 'available' : 'unavailable'}`,
      food
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  toggleAvailability,
};
