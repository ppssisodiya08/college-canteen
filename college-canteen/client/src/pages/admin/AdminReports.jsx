import { useState, useEffect } from 'react';
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
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import * as dashboardService from '../../services/dashboardService';
import Spinner from '../../components/common/Spinner';
import { formatPrice } from '../../utils/formatCurrency';

const STATUS_COLORS = {
  Pending: '#eab308',
  Confirmed: '#3b82f6',
  Preparing: '#f97316',
  Ready: '#22c55e',
  Completed: '#64748b',
  Cancelled: '#ef4444',
};

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    salesToday: 0,
    salesThisMonth: 0,
    totalRevenue: 0,
    ordersToday: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, salesRes, statusRes, foodsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesData(),
          dashboardService.getOrderStatusBreakdown(),
          dashboardService.getPopularFoods(),
        ]);

        if (isMounted) {
          setStats(statsRes.data?.data || {});
          setSalesData(salesRes.data?.data || []);
          setStatusData(statusRes.data?.data || []);
          setPopularFoods(foodsRes.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch financial reports.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReportData();
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

  const maxQuantity = popularFoods.length > 0 ? Math.max(...popularFoods.map((f) => f.totalQuantity || 1)) : 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal-900">Analytics & Sales Reports</h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          In-depth financial review, order volumes, revenue distribution, and product trends.
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="card p-6 border border-charcoal-100 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0">
            <FiCalendar className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">
              Today's Revenue
            </span>
            <span className="text-2xl font-display font-extrabold text-charcoal-900">
              {formatPrice(stats.salesToday)}
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              {stats.ordersToday} orders placed today
            </span>
          </div>
        </div>

        <div className="card p-6 border border-charcoal-100 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl flex-shrink-0">
            <FiTrendingUp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">
              This Month's Revenue
            </span>
            <span className="text-2xl font-display font-extrabold text-charcoal-900">
              {formatPrice(stats.salesThisMonth)}
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              Current calendar month
            </span>
          </div>
        </div>

        <div className="card p-6 border border-charcoal-100 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
            <FiDollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">
              Lifetime Revenue
            </span>
            <span className="text-2xl font-display font-extrabold text-charcoal-900">
              {formatPrice(stats.totalRevenue)}
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              All completed counter orders
            </span>
          </div>
        </div>
      </div>

      {/* 30-Day Sales Chart */}
      <div className="card p-6 border border-charcoal-100 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-charcoal-100">
          <div>
            <h2 className="font-display font-bold text-lg text-charcoal-900">
              Last 30 Days Sales Performance
            </h2>
            <p className="text-xs text-charcoal-500">Gross daily revenues recorded from canteen pickups</p>
          </div>
          <span className="badge badge-orange">Monthly Curve</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <Tooltip
                formatter={(val) => [`₹${Number(val).toFixed(2)}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#f97316"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#reportGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Popular Foods & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Popular Foods with Bar Indicators */}
        <div className="lg:col-span-7 card p-6 border border-charcoal-100 shadow-xs">
          <h2 className="font-display font-bold text-lg text-charcoal-900 mb-1">
            Top Performing Foods
          </h2>
          <p className="text-xs text-charcoal-500 mb-6">
            Ranked by overall units sold
          </p>

          <div className="space-y-4">
            {popularFoods.length === 0 ? (
              <p className="text-center text-charcoal-400 text-xs py-8">No food items sold yet.</p>
            ) : (
              popularFoods.map((item, idx) => {
                const percent = Math.round((item.totalQuantity / maxQuantity) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal-400 text-xs">#{idx + 1}</span>
                        <span className="font-semibold text-charcoal-900">{item.foodName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-charcoal-500 font-medium">
                          {item.totalQuantity} units
                        </span>
                        <span className="font-bold text-primary-600 text-xs">
                          {formatPrice(item.revenue)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-charcoal-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Status Pie Breakdown */}
        <div className="lg:col-span-5 card p-6 border border-charcoal-100 shadow-xs flex flex-col">
          <h2 className="font-display font-bold text-lg text-charcoal-900 mb-1">
            Status Breakdown
          </h2>
          <p className="text-xs text-charcoal-500 mb-4">
            Proportion of orders by final fulfillment state
          </p>

          <div className="h-64 w-full flex items-center justify-center">
            {statusData.length > 0 && statusData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={75}
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
                No status data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
