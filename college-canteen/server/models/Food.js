const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide food name'],
      trim: true,
      maxlength: [100, 'Food name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide food price'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: 'https://placehold.co/400x300/f97316/ffffff?text=Food+Item',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify category'],
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, 'Stock cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: String,
      default: '10-15 mins',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: isInStock
foodSchema.virtual('isInStock').get(function () {
  return this.stock > 0;
});

// Indexes
foodSchema.index({ category: 1 });
foodSchema.index({ isAvailable: 1 });
foodSchema.index({ name: 'text', description: 'text' });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
