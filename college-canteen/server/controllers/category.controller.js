const mongoose = require('mongoose');
const Category = require('../models/Category');
const Food = require('../models/Food');
const { sendSuccess, createError } = require('../utils/apiResponse');

/**
 * @desc    Get all active categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
  try {
    // If admin is requesting, they might want all categories, but public gets active
    const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });

    return sendSuccess(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    const category = await Category.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    return sendSuccess(res, 200, 'Category retrieved successfully', category);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name || !name.trim()) {
      return next(createError('Category name is required', 400));
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existingCategory) {
      return next(createError('A category with this name already exists', 409));
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      image: image ? image.trim() : '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return sendSuccess(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    const category = await Category.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (existing) {
        return next(createError('A category with this name already exists', 409));
      }
      category.name = name.trim();
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image.trim();
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();

    return sendSuccess(res, 200, 'Category updated successfully', updatedCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category (only if no foods reference it)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid category ID', 400));
    }

    const category = await Category.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    const foodCount = await Food.countDocuments({ category: id });
    if (foodCount > 0) {
      return next(
        createError(
          `Cannot delete category. There are ${foodCount} food item(s) associated with it.`,
          400
        )
      );
    }

    await Category.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
