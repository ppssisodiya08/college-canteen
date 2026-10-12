const express = require('express');
const router = express.Router();
const {
  getStats,
  getRecentOrders,
  getSalesData,
  getPopularFoods,
  getOrderStatusBreakdown,
} = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/stats', protect, restrictTo('admin'), getStats);
router.get('/recent-orders', protect, restrictTo('admin'), getRecentOrders);
router.get('/sales', protect, restrictTo('admin'), getSalesData);
router.get('/popular-foods', protect, restrictTo('admin'), getPopularFoods);
router.get('/order-status-breakdown', protect, restrictTo('admin'), getOrderStatusBreakdown);

module.exports = router;
