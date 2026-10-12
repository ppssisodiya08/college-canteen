const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, restrictTo('admin'), updateOrderStatus);
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
