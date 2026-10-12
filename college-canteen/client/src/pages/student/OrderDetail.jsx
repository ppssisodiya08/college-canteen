import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiPackage,
} from 'react-icons/fi';
import * as orderService from '../../services/orderService';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';

const ORDER_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrderById(id);
      setOrder(res.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      setCancelModalOpen(false);
      fetchOrderDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container py-20 text-center">
        <div className="card max-w-md mx-auto py-10">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="text-charcoal-500 text-sm mb-6">{error || 'Order record does not exist.'}</p>
          <Link to="/my-orders" className="btn-primary btn-sm inline-flex items-center gap-2">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-container py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-primary-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>

      {/* Header Info Card */}
      <div className="card p-6 sm:p-8 border border-charcoal-100 shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-charcoal-900">
                {order.orderNumber}
              </h1>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-charcoal-500">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="btn-danger btn-sm flex items-center gap-1.5"
              >
                <FiXCircle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Tracker Progress Bar */}
        {!isCancelled ? (
          <div className="pt-8 pb-4">
            <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-6 text-center sm:text-left">
              Live Cooking & Pickup Tracker
            </p>
            <div className="grid grid-cols-5 gap-2 relative">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                          : isPassed
                          ? 'bg-green-500 text-white'
                          : 'bg-charcoal-100 text-charcoal-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-medium leading-tight ${
                        isCurrent
                          ? 'text-primary-600 font-bold'
                          : isPassed
                          ? 'text-charcoal-800'
                          : 'text-charcoal-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <FiXCircle className="w-5 h-5 flex-shrink-0" />
            <span>This order was cancelled. Stock has been returned to the menu inventory.</span>
          </div>
        )}
      </div>

      {/* Grid: Order Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8">
          <div className="card p-6 border border-charcoal-100 shadow-xs">
            <h2 className="font-display font-bold text-lg text-charcoal-900 mb-4 pb-2 border-b border-charcoal-100">
              Ordered Items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-charcoal-200 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-charcoal-50/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.food?.image || FALLBACK_FOOD_IMAGE}
                            alt={item.foodName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_FOOD_IMAGE;
                            }}
                            className="w-10 h-10 rounded-lg object-cover bg-charcoal-100"
                          />
                          <div>
                            <p className="font-semibold text-charcoal-900">{item.foodName}</p>
                            {item.food?.preparationTime && (
                              <p className="text-[11px] text-charcoal-400">
                                {item.food.preparationTime}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold text-charcoal-800">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-charcoal-600">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-bold text-charcoal-900">
                        {formatPrice(item.subtotal || item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {order.notes && (
              <div className="mt-6 pt-4 border-t border-charcoal-100 bg-orange-50/50 p-4 rounded-xl">
                <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block mb-1">
                  Special Notes:
                </span>
                <p className="text-sm text-charcoal-800 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Student Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 border border-charcoal-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-charcoal-900 pb-3 border-b border-charcoal-100">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Taxes</span>
                <span className="font-semibold text-green-600">₹0.00</span>
              </div>
              <div className="border-t border-charcoal-100 pt-3 flex justify-between text-base">
                <span className="font-bold text-charcoal-900">Grand Total</span>
                <span className="font-extrabold text-xl text-primary-600">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            <div className="border-t border-charcoal-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Method:</span>
                <span className="font-semibold text-charcoal-800 capitalize">
                  {order.paymentMethod} at Counter
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-500">Payment Status:</span>
                <span
                  className={`badge ${
                    order.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? It will be marked cancelled immediately."
        confirmText="Confirm Cancellation"
        confirmClassName="btn-danger"
        loading={cancelling}
      />
    </div>
  );
}
