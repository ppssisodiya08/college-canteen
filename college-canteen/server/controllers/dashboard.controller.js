const User = require('../models/User');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      totalFoods,
      totalCategories,
      ordersToday,
      pendingOrders,
      salesTodayAgg,
      salesThisMonthAgg,
      totalRevenueAgg,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Food.countDocuments(),
      Category.countDocuments({ isActive: true }),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.aggregate([
        { $match: { orderStatus: 'Completed', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: 'Completed', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const salesToday = salesTodayAgg.length > 0 ? salesTodayAgg[0].total : 0;
    const salesThisMonth = salesThisMonthAgg.length > 0 ? salesThisMonthAgg[0].total : 0;
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    return sendSuccess(res, 200, 'Dashboard statistics fetched successfully', {
      totalStudents,
      totalFoods,
      totalCategories,
      ordersToday,
      pendingOrders,
      salesToday,
      salesThisMonth,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent 10 orders
 * @route   GET /api/dashboard/recent-orders
 * @access  Private/Admin
 */
const getRecentOrders = async (req, res, next) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'name email phone studentId')
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, 200, 'Recent orders fetched successfully', recentOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get daily sales data for the last 30 days
 * @route   GET /api/dashboard/sales
 * @access  Private/Admin
 */
const getSalesData = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const salesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          sales: {
            $sum: {
              $cond: [{ $eq: ['$orderStatus', 'Completed'] }, '$totalAmount', 0],
            },
          },
          orders: { $sum: 1 },
        },
      },
    ]);

    const salesMap = {};
    salesAgg.forEach((item) => {
      salesMap[item._id] = {
        sales: item.sales,
        orders: item.orders,
      };
    });

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Build array for every day in the last 30 days
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoKey = d.toISOString().slice(0, 10);
      const formattedDate = `${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

      result.push({
        date: formattedDate,
        sales: salesMap[isoKey]?.sales || 0,
        orders: salesMap[isoKey]?.orders || 0,
      });
    }

    return sendSuccess(res, 200, 'Sales data fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top 5 most popular foods
 * @route   GET /api/dashboard/popular-foods
 * @access  Private/Admin
 */
const getPopularFoods = async (req, res, next) => {
  try {
    const popularFoods = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.foodName',
          foodName: { $first: '$items.foodName' },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          foodName: 1,
          totalOrders: 1,
          totalQuantity: 1,
          revenue: 1,
        },
      },
    ]);

    return sendSuccess(res, 200, 'Popular foods fetched successfully', popularFoods);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order counts grouped by status
 * @route   GET /api/dashboard/order-status-breakdown
 * @access  Private/Admin
 */
const getOrderStatusBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    const countMap = {};
    breakdown.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const result = statuses.map((status) => ({
      status,
      count: countMap[status] || 0,
    }));

    return sendSuccess(res, 200, 'Order status breakdown fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getRecentOrders,
  getSalesData,
  getPopularFoods,
  getOrderStatusBreakdown,
};
