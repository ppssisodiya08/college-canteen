import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiCoffee,
  FiShoppingBag,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import * as dashboardService from '../../services/dashboardService';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const STATUS_COLORS = {
  Pending: '#eab308',
  Confirmed: '#3b82f6',
  Preparing: '#f97316',
  Ready: '#22c55e',
  Completed: '#64748b',
  Cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFoods: 0,
    ordersToday: 0,
    pendingOrders: 0,
    salesToday: 0,
    salesThisMonth: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, salesRes, statusRes, ordersRes, foodsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesData(),
          dashboardService.getOrderStatusBreakdown(),
          dashboardService.getRecentOrders(),
          dashboardService.getPopularFoods(),
        ]);

        if (isMounted) {
          setStats(statsRes.data?.data || {});
          setSalesData(salesRes.data?.data || []);
          setStatusData(statusRes.data?.data || []);
          setRecentOrders(ordersRes.data?.data || []);
          setPopularFoods(foodsRes.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Spinner size="lg" className="py-24" />;
  }

  if (error) {
    return (
      <div className="card text-center py-12 text-red-600">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: FiUsers,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Total Foods',
      value: stats.totalFoods,
      icon: FiCoffee,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Orders Today',
      value: stats.ordersToday,
      icon: FiShoppingBag,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiClock,
      color: 'bg-red-50 text-red-600 border-red-100',
    },
    {
      label: 'Sales Today',
      value: formatPrice(stats.salesToday),
      icon: FiDollarSign,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      label: 'Sales This Month',
      value: formatPrice(stats.salesThisMonth),
      icon: FiTrendingUp,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Stats Cards Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${item.color} bg-white shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-display font-extrabold text-charcoal-900 truncate">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row (Recharts) ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Sales Trend Chart (AreaChart) */}
        <div className="lg:col-span-8 card p-6 border border-charcoal-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-charcoal-100">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900">
                Daily Revenue Trend
              </h3>
              <p className="text-xs text-charcoal-500">Sales performance over the last 30 days</p>
            </div>
            <span className="badge badge-orange font-semibold">Last 30 Days</span>
          </div>

          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toFixed(2)}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown (PieChart) */}
        <div className="lg:col-span-4 card p-6 border border-charcoal-100 shadow-xs flex flex-col">
          <div className="mb-4 pb-2 border-b border-charcoal-100">
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              Orders Status Breakdown
            </h3>
            <p className="text-xs text-charcoal-500">Distribution across current workflow</p>
          </div>

          <div className="h-72 w-full flex-1 flex items-center justify-center">
            {statusData.length > 0 && statusData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || '#cbd5e1'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-charcoal-400 py-12">
                No orders data to display
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Orders & Popular Foods ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 card p-6 border border-charcoal-100 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-charcoal-100">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900">
                Recent Orders
              </h3>
              <p className="text-xs text-charcoal-500">Latest orders placed on campus</p>
            </div>
            <Link to="/admin/orders" className="btn-ghost btn-sm text-primary-600 flex items-center gap-1">
              <span>View All</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-charcoal-200 text-charcoal-400 uppercase text-[11px] font-semibold">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-charcoal-400">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-charcoal-50/50">
                      <td className="py-3 font-mono font-bold text-charcoal-800">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 text-charcoal-700">
                        {ord.user?.name || 'Student'}
                      </td>
                      <td className="py-3 font-bold text-charcoal-900">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={ord.orderStatus} />
                      </td>
                      <td className="py-3 text-right text-charcoal-500 text-xs">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>        </div>

        {/* Popular Foods List */}
        <div className="lg:col-span-5 card p-6 border border-charcoal-100 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-charcoal-100">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900">
                Top Popular Dishes
              </h3>
              <p className="text-xs text-charcoal-500">Highest volume items ordered</p>
            </div>
            <Link to="/admin/foods" className="btn-ghost btn-sm text-primary-600 flex items-center gap-1">
              <span>Manage Foods</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {popularFoods.length === 0 ? (
              <p className="text-center text-charcoal-400 text-xs py-6">
                No popular food data recorded yet.
              </p>
            ) : (
              popularFoods.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-charcoal-50 hover:bg-orange-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{item.foodName}</p>
                      <p className="text-xs text-charcoal-500">
                        {item.totalQuantity} units sold ({item.totalOrders} orders)
                      </p>
                    </div>
                  </div>

                  <span className="font-display font-bold text-sm text-primary-600">
                    {formatPrice(item.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
