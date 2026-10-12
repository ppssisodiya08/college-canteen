const mongoose = require('mongoose');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { sendSuccess, createError } = require('../utils/apiResponse');

// Helper to generate a unique order number (e.g. ORD-20261012-9843)
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomStr}`;
};

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private/Student (and Admin)
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod = 'cash', notes = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(createError('Order must contain at least one item', 400));
    }

    // Validate format of items
    for (const item of items) {
      if (!item.foodId || !mongoose.Types.ObjectId.isValid(item.foodId)) {
        return next(createError('Each item must contain a valid foodId', 400));
      }
      const qty = parseInt(item.quantity, 10);
      if (!qty || qty < 1) {
        return next(createError('Item quantity must be at least 1', 400));
      }
    }

    // Step 1: Fetch and validate all food items & current DB prices
    const foodItems = [];
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return next(createError(`Food item with ID ${item.foodId} not found`, 404));
      }
      if (!food.isAvailable) {
        return next(createError(`"${food.name}" is currently marked unavailable`, 400));
      }
      if (food.stock < item.quantity) {
        return next(
          createError(
            `Insufficient stock for "${food.name}". Available: ${food.stock}, requested: ${item.quantity}`,
            400
          )
        );
      }
      foodItems.push({
        food,
        quantity: parseInt(item.quantity, 10),
      });
    }

    // Step 2: Atomic stock deduction with rollback
    const updatedFoods = [];
    for (const { food, quantity } of foodItems) {
      const updatedFood = await Food.findOneAndUpdate(
        { _id: food._id, stock: { $gte: quantity }, isAvailable: true },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedFood) {
        // Rollback all already deducted items
        for (const rolledBack of updatedFoods) {
          await Food.findByIdAndUpdate(rolledBack.foodId, {
            $inc: { stock: rolledBack.quantity },
          });
        }
        return next(
          createError(
            `Could not reserve stock for "${food.name}". Please try again.`,
            400
          )
        );
      }

      updatedFoods.push({ foodId: food._id, quantity });
    }

    // Step 3: Calculate subtotal and build snapshot items
    let subtotal = 0;
    const orderItems = foodItems.map(({ food, quantity }) => {
      const lineSubtotal = food.price * quantity;
      subtotal += lineSubtotal;
      return {
        food: food._id,
        foodName: food.name,
        quantity,
        unitPrice: food.price,
        subtotal: lineSubtotal,
      };
    });

    const totalAmount = subtotal;

    // Step 4: Ensure orderNumber is unique
    let orderNumber = generateOrderNumber();
    let collision = await Order.findOne({ orderNumber });
    while (collision) {
      orderNumber = generateOrderNumber();
      collision = await Order.findOne({ orderNumber });
    }

    // Step 5: Save order
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      subtotal,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'counter' ? 'pending' : 'pending',
      orderStatus: 'Pending',
      notes: notes ? notes.trim() : '',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email studentId phone')
      .populate('items.food', 'name image price');

    return sendSuccess(res, 201, 'Order placed successfully', populatedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in student's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food', 'name image price preparationTime')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id)
      .populate('user', 'name email studentId phone')
      .populate('items.food', 'name image price preparationTime');

    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Students can only see their own orders
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return next(createError('You are not authorized to view this order', 403));
    }

    return sendSuccess(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, date, search, page = 1, limit = 20 } = req.query;

    const query = {};

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Search by orderNumber
    if (search && search.trim()) {
      query.orderNumber = { $regex: search.trim(), $options: 'i' };
    }

    // Date filter: today, week, month
    if (date) {
      const now = new Date();
      if (date === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        query.createdAt = { $gte: startOfDay };
      } else if (date === 'week') {
        const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: pastWeek };
      } else if (date === 'month') {
        const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: pastMonth };
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const orders = await Order.find(query)
      .populate('user', 'name email studentId phone')
      .populate('items.food', 'name image price')
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

    return sendSuccess(res, 200, 'All orders retrieved successfully', orders, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    if (!status) {
      return next(createError('Status is required', 400));
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(createError('Order not found', 404));
    }

    if (order.orderStatus === 'Cancelled' || order.orderStatus === 'Completed') {
      return next(
        createError(`Cannot change status of an order that is already ${order.orderStatus}`, 400)
      );
    }

    // Allowed transition map:
    // Pending -> Confirmed
    // Confirmed -> Preparing
    // Preparing -> Ready
    // Ready -> Completed
    const validTransitions = {
      Pending: ['Confirmed'],
      Confirmed: ['Preparing'],
      Preparing: ['Ready'],
      Ready: ['Completed'],
    };

    const allowedNext = validTransitions[order.orderStatus] || [];
    if (!allowedNext.includes(status)) {
      return next(
        createError(
          `Invalid status transition from "${order.orderStatus}" to "${status}". Allowed next status: ${allowedNext.join(', ') || 'none'}`,
          400
        )
      );
    }

    order.orderStatus = status;

    // If order is completed and was cash/counter payment, mark as paid if not already
    if (status === 'Completed' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email studentId phone')
      .populate('items.food', 'name image price');

    return sendSuccess(res, 200, `Order status updated to ${status}`, updatedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order (student cancels their own Pending or Confirmed order; stock is restored)
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid order ID', 400));
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(createError('Order not found', 404));
    }

    // Check ownership if not admin
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return next(createError('You are not authorized to cancel this order', 403));
    }

    // Can only cancel Pending or Confirmed orders
    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return next(
        createError(
          `Cannot cancel order with status "${order.orderStatus}". Only Pending or Confirmed orders can be cancelled.`,
          400
        )
      );
    }

    // Restore stock for all items
    for (const item of order.items) {
      if (item.food) {
        await Food.findByIdAndUpdate(item.food, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email studentId phone')
      .populate('items.food', 'name image price');

    return sendSuccess(res, 200, 'Order cancelled successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
