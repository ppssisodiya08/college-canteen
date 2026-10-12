import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatCurrency';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';
import EmptyState from '../../components/common/EmptyState';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_FOOD_IMAGE;
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          message="Looks like you haven't added any tasty food to your cart yet. Browse our daily menu and pick your favorites!"
          action={
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4" />
              <span>Browse Menu</span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-charcoal-200 mb-8">
        <div>
          <h1 className="section-title">Your Food Cart</h1>
          <p className="section-subtitle">
            Review your items and proceed to the counter checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="card p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 border border-charcoal-100"
            >
              {/* Food Image */}
              <img
                src={item.image || FALLBACK_FOOD_IMAGE}
                alt={item.name}
                onError={handleImageError}
                className="w-20 h-20 rounded-xl object-cover bg-charcoal-100 flex-shrink-0"
              />

              {/* Title & Unit Price */}
              <div className="flex-1 text-center sm:text-left">
                <Link
                  to={`/menu/${item._id}`}
                  className="font-display font-bold text-base text-charcoal-900 hover:text-primary-600 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Unit Price: {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-charcoal-200 rounded-xl bg-charcoal-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  className="p-2 text-charcoal-600 hover:bg-charcoal-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-sm font-bold text-charcoal-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  disabled={Boolean(item.stock && item.quantity >= item.stock)}
                  className="p-2 text-charcoal-600 hover:bg-charcoal-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[80px]">
                <span className="font-display font-bold text-base text-charcoal-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeFromCart(item._id)}
                className="text-charcoal-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                aria-label={`Remove ${item.name} from cart`}
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="card p-6 border border-charcoal-100 shadow-md sticky top-24 space-y-6">
            <h2 className="font-display font-bold text-xl text-charcoal-900 pb-4 border-b border-charcoal-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-charcoal-600">
                <span>Total Items</span>
                <span className="font-semibold text-charcoal-800">{itemCount} items</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-600">
                <span>Taxes & Fees</span>
                <span className="font-semibold text-green-600">₹0.00 (Included)</span>
              </div>

              <div className="border-t border-charcoal-100 pt-3 flex items-center justify-between text-base">
                <span className="font-display font-bold text-charcoal-900">Grand Total</span>
                <span className="font-display font-extrabold text-2xl text-primary-600">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full justify-center py-3.5 text-base shadow-md flex items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center">
              <Link
                to="/menu"
                className="text-xs text-charcoal-500 hover:text-primary-600 font-medium transition-colors"
              >
                + Add more dishes from menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
