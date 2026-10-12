const express = require('express');
const router = express.Router();
const {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  toggleAvailability,
} = require('../controllers/food.controller');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', protect, restrictTo('admin'), upload.single('image'), createFood);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateFood);
router.delete('/:id', protect, restrictTo('admin'), deleteFood);
router.patch('/:id/availability', protect, restrictTo('admin'), toggleAvailability);

module.exports = router;
