import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiEye, FiClock, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import * as orderService from '../../services/orderService';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import { ORDER_STATUS, FALLBACK_FOOD_IMAGE } from '../../utils/constants';

const VALID_NEXT_STATUS = {
  Pending: ['Confirmed'],
  Confirmed: ['Preparing'],
  Preparing: ['Ready'],
  Ready: ['Completed'],
  Completed: [],
  Cancelled: [],
};

export default function AdminOrders() {
  const { toasts, toast, removeToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Updating status
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 15,
      };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await orderService.getAllOrders(params);
      setOrders(res.data?.data || []);
      setMeta(res.data?.meta || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve orders.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      toast(`Order status updated to ${newStatus}`, 'success');
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (viewingOrder && viewingOrder._id === orderId) {
        setViewingOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = (order) => {
    setViewingOrder(order);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal-900">Order Management</h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          Track customer queues, confirm incoming requests, and dispatch meals at the counter.
        </p>
      </div>

      {/* Filter Row */}
      <div className="card p-4 border border-charcoal-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search by Token */}
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order token (e.g. ORD-...)..."
            className="input pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input py-2.5 text-sm bg-white cursor-pointer"
            aria-label="Filter orders by status"
          >
            <option value="">All Statuses</option>
            {Object.values(ORDER_STATUS).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 border border-charcoal-100 shadow-xs overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <FiAlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchOrders} className="btn-outline btn-sm mt-3">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <p className="text-base font-semibold text-charcoal-800 mb-1">No orders found</p>
            <p className="text-xs">No customer orders match the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal-50 border-b border-charcoal-200 text-xs text-charcoal-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Token #</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Next Step</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {orders.map((ord) => {
                  const allowedNext = VALID_NEXT_STATUS[ord.orderStatus] || [];
                  const itemCount = ord.items?.reduce((acc, it) => acc + (it.quantity || 1), 0);

                  return (
                    <tr key={ord._id} className="hover:bg-charcoal-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-charcoal-900">
                        {ord.orderNumber}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-charcoal-800">
                          {ord.user?.name || 'Walk-in Student'}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {ord.user?.studentId || ord.user?.email || '—'}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-center font-semibold text-charcoal-700">
                        {itemCount}
                      </td>

                      <td className="py-4 px-4 font-bold text-charcoal-900">
                        {formatPrice(ord.totalAmount)}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={ord.orderStatus} />
                      </td>

                      <td className="py-4 px-4">
                        {allowedNext.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            {allowedNext.map((nextSt) => (
                              <button
                                key={nextSt}
                                type="button"
                                onClick={() => handleStatusChange(ord._id, nextSt)}
                                disabled={updatingId === ord._id}
                                className="btn-primary btn-sm py-1 px-2.5 text-xs shadow-xs"
                              >
                                {updatingId === ord._id ? 'Updating...' : `Advance to ${nextSt}`}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal-400 italic">None</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(ord)}
                          className="btn-outline btn-sm py-1.5 px-3 flex items-center gap-1 ml-auto"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-charcoal-100">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Order Details — ${viewingOrder?.orderNumber || ''}`}
        maxWidth="max-w-2xl"
      >
        {viewingOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-charcoal-50 text-xs">
              <div>
                <span className="text-charcoal-400 block font-medium">Customer</span>
                <span className="font-bold text-charcoal-800">{viewingOrder.user?.name}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Phone</span>
                <span className="font-bold text-charcoal-800">{viewingOrder.user?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Placed At</span>
                <span className="font-bold text-charcoal-800">{formatDateTime(viewingOrder.createdAt)}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Current Status</span>
                <div className="mt-0.5">
                  <StatusBadge status={viewingOrder.orderStatus} />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">
                Ordered Items
              </h3>
              <div className="divide-y divide-charcoal-100 border rounded-xl overflow-hidden">
                {viewingOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-sm bg-white">
                    <div>
                      <p className="font-semibold text-charcoal-900">{it.foodName}</p>
                      <p className="text-xs text-charcoal-500">
                        Qty: {it.quantity} × {formatPrice(it.unitPrice)}
                      </p>
                    </div>
                    <span className="font-bold text-charcoal-900">
                      {formatPrice(it.subtotal || it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {viewingOrder.notes && (
              <div className="p-3 rounded-xl bg-orange-50 text-xs text-charcoal-800">
                <span className="font-bold block mb-1">Student Special Note:</span>
                <p className="italic">"{viewingOrder.notes}"</p>
              </div>
            )}

            <div className="pt-2 border-t border-charcoal-100 flex justify-between items-center text-sm font-bold">
              <span>Total Amount:</span>
              <span className="text-xl text-primary-600">{formatPrice(viewingOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
