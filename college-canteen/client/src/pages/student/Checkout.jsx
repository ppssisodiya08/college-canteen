import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft, FiShoppingBag, FiCreditCard } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import * as orderService from '../../services/orderService';
import { formatPrice } from '../../utils/formatCurrency';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('counter');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems, navigate]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_FOOD_IMAGE;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    try {
      setSubmitting(true);
      setError('');

      const orderPayload = {
        items: cartItems.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod || 'counter',
        notes: notes.trim(),
      };

      const res = await orderService.createOrder(orderPayload);
      const placedOrder = res.data?.data;

      // Clear the cart on successful placement
      clearCart();

      // Navigate to order success with order state
      navigate('/order-success', {
        state: { order: placedOrder },
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to place order. Some items may have insufficient stock or are unavailable.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-primary-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title">Checkout & Place Order</h1>
        <p className="section-subtitle">
          Confirm your meal details and pick up token.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Order Information & Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Student Info Card */}
          <div className="card p-6 border border-charcoal-100">
            <h2 className="font-display font-bold text-lg text-charcoal-900 mb-4 pb-2 border-b border-charcoal-100">
              Pickup Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-charcoal-400 block text-xs">Student Name</span>
                <span className="font-semibold text-charcoal-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-xs">College Email</span>
                <span className="font-semibold text-charcoal-800">{user?.email}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-xs">Student ID</span>
                <span className="font-semibold text-charcoal-800">{user?.studentId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-xs">Contact Phone</span>
                <span className="font-semibold text-charcoal-800">{user?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6 border border-charcoal-100">
            <h2 className="font-display font-bold text-lg text-charcoal-900 mb-4 pb-2 border-b border-charcoal-100">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'counter'
                    ? 'border-primary-500 bg-orange-50/50 shadow-xs'
                    : 'border-charcoal-200 hover:bg-charcoal-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="counter"
                  checked={paymentMethod === 'counter'}
                  onChange={() => setPaymentMethod('counter')}
                  className="mt-1 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <span className="font-semibold text-sm text-charcoal-900 block">
                    Cash / UPI at Counter
                  </span>
                  <span className="text-xs text-charcoal-500 block mt-0.5">
                    Pay with Cash, GPay, PhonePe, or Paytm directly when collecting your tray.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Notes */}
          <div className="card p-6 border border-charcoal-100">
            <h2 className="font-display font-bold text-lg text-charcoal-900 mb-2">
              Special Instructions (Optional)
            </h2>
            <p className="text-xs text-charcoal-500 mb-3">
              Specify spice level, extra tissues, no onions, etc.
            </p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Less spicy, pack extra ketchup sachets please..."
              className="input text-sm"
              maxLength={250}
            />
          </div>
        </div>

        {/* Right Side: Order Review & Submit */}
        <div className="lg:col-span-5">
          <div className="card p-6 border border-charcoal-100 shadow-md sticky top-24 space-y-6">
            <h2 className="font-display font-bold text-lg text-charcoal-900 pb-3 border-b border-charcoal-100">
              Order Review ({cartItems.length} items)
            </h2>

            {/* Read-only items list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-1">
                  <img
                    src={item.image || FALLBACK_FOOD_IMAGE}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-12 h-12 rounded-lg object-cover bg-charcoal-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-charcoal-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-100 pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-600">
                <span>Taxes & Handling</span>
                <span className="font-semibold text-green-600">₹0.00</span>
              </div>
              <div className="border-t border-charcoal-100 pt-3 flex items-center justify-between text-base">
                <span className="font-display font-bold text-charcoal-900">Total Payable</span>
                <span className="font-display font-extrabold text-2xl text-primary-600">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="btn-primary w-full justify-center py-3.5 text-base shadow-md flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="p-0 text-white" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Confirm & Place Order</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
