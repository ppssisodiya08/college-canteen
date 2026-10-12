import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiXCircle, FiShoppingBag, FiClock, FiCalendar } from 'react-icons/fi';
import * as orderService from '../../services/orderService';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancel order modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getMyOrders();
      setOrders(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderId) return;
    try {
      setCancelling(true);
      await orderService.cancelOrder(selectedOrderId);
      setCancelModalOpen(false);
      setSelectedOrderId(null);
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="page-container py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle">
          Track the live cooking status and history of your meal orders.
        </p>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : error ? (
        <div className="card text-center py-10 text-red-600">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="btn-outline btn-sm mt-4 inline-flex"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Orders Yet"
          message="You haven't placed any orders with the college canteen yet. When you do, you can track their status here!"
          action={
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4" />
              <span>Browse Menu & Order</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
            const totalItemsCount = order.items?.reduce(
              (acc, item) => acc + (item.quantity || 1),
              0
            );

            return (
              <div
                key={order._id}
                className="card p-5 sm:p-6 border border-charcoal-100/90 hover:border-primary-200 transition-all shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base sm:text-lg text-charcoal-900">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-500">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>{formatDateTime(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-xs text-charcoal-400 block font-medium">Total Amount</span>
                    <span className="text-xl font-display font-extrabold text-primary-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-charcoal-600">
                  <div className="flex-1">
                    <span className="font-medium text-charcoal-800">
                      {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''}:{' '}
                    </span>
                    <span className="text-xs text-charcoal-500 line-clamp-1">
                      {order.items?.map((it) => `${it.foodName || it.food?.name} (x${it.quantity})`).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleOpenCancel(order._id)}
                        className="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5"
                      >
                        <FiXCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}

                    <Link
                      to={`/my-orders/${order._id}`}
                      className="btn-outline btn-sm flex items-center gap-1.5"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? Stock will be restored and this action cannot be undone."
        confirmText="Yes, Cancel Order"
        confirmClassName="btn-danger"
        loading={cancelling}
      />
    </div>
  );
}
