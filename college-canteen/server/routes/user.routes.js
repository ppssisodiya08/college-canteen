const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  toggleUserStatus,
} = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('admin'), getAllUsers);
router.get('/:id', protect, restrictTo('admin'), getUserById);
router.patch('/:id/status', protect, restrictTo('admin'), toggleUserStatus);

module.exports = router;
