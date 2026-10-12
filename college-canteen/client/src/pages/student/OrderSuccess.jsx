import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiList, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatCurrency';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/menu', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="page-container py-12 sm:py-20 flex justify-center">
      <div className="card max-w-lg w-full text-center p-8 sm:p-12 border border-orange-100 shadow-xl space-y-6">
        {/* Animated Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-5xl mx-auto shadow-inner">
          <FiCheckCircle className="w-12 h-12" />
        </div>

        <div>
          <span className="badge badge-green font-bold text-xs uppercase px-3 py-1 mb-2 inline-block">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal-900">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Thank you for ordering with the College Canteen.
          </p>
        </div>

        {/* Prominent Order Number Card */}
        <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-5 space-y-2">
          <p className="text-xs uppercase tracking-wider text-charcoal-500 font-bold">
            Your Order Pickup Token
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-extrabold text-primary-600 tracking-wider">
            {order.orderNumber}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal-600 pt-1">
            <FiClock className="w-4 h-4 text-primary-500" />
            <span>Estimated prep time: ~10-15 minutes</span>
          </div>
        </div>

        {/* Order Details Brief */}
        <div className="border-t border-charcoal-100 pt-4 text-xs text-charcoal-600 space-y-1">
          <div className="flex justify-between">
            <span>Total Payable:</span>
            <strong className="text-charcoal-900">{formatPrice(order.totalAmount)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Payment Mode:</span>
            <strong className="text-charcoal-900 capitalize">{order.paymentMethod} at Counter</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={`/my-orders/${order._id}`}
            className="btn-primary w-full justify-center flex items-center gap-2"
          >
            <FiList className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
          <Link
            to="/menu"
            className="btn-outline w-full justify-center flex items-center gap-2"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
