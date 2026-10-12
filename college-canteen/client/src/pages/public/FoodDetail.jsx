import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiPlus, FiMinus, FiShoppingCart, FiCheck } from 'react-icons/fi';
import * as foodService from '../../services/foodService';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';
import { formatPrice } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';
import Spinner from '../../components/common/Spinner';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await foodService.getFoodById(id);
        if (isMounted) {
          setFood(res.data?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Food item not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_FOOD_IMAGE;
  };

  const handleIncrement = () => {
    if (food && food.stock && quantity >= food.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!food || food.isAvailable === false || food.stock === 0) return;
    addToCart(food, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="page-container py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="page-container py-20 text-center">
        <div className="card max-w-md mx-auto py-10">
          <span className="text-4xl block mb-3">🍲</span>
          <h2 className="text-xl font-bold mb-2">Item Not Found</h2>
          <p className="text-charcoal-500 text-sm mb-6">{error || 'The food item you requested does not exist.'}</p>
          <Link to="/menu" className="btn-primary btn-sm inline-flex items-center gap-2">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = food.stock === 0 || food.isAvailable === false;
  const categoryName = food.category?.name || (typeof food.category === 'string' ? food.category : 'General');

  return (
    <div className="page-container py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-primary-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="card p-6 sm:p-10 border border-charcoal-100 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Food Image */}
        <div className="md:col-span-6 relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-charcoal-100 shadow-md">
          <img
            src={food.image || FALLBACK_FOOD_IMAGE}
            alt={food.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 z-10">
            <span className="badge bg-white/95 text-charcoal-900 font-semibold shadow-sm text-xs">
              {categoryName}
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="badge badge-red font-bold text-sm uppercase px-4 py-2 shadow-lg">
                {food.stock === 0 ? 'Out of Stock' : 'Currently Unavailable'}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {food.preparationTime && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-500 bg-charcoal-100 px-3 py-1 rounded-full">
                  <FiClock className="w-3.5 h-3.5 text-primary-500" />
                  <span>Ready in {food.preparationTime}</span>
                </div>
              )}
              {food.stock > 0 && !isOutOfStock && (
                <span className="badge badge-green text-xs">
                  In Stock ({food.stock} available)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-900 mb-3">
              {food.name}
            </h1>

            <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed mb-6">
              {food.description || 'Prepared fresh daily with authentic ingredients and the best flavors.'}
            </p>

            <div className="text-3xl font-display font-extrabold text-primary-600 mb-6">
              {formatPrice(food.price)}
            </div>
          </div>

          {/* Action section */}
          <div className="pt-6 border-t border-charcoal-100 space-y-6">
            {!isOutOfStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-charcoal-700">Quantity:</span>
                  <div className="flex items-center border border-charcoal-300 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-3 text-charcoal-600 hover:bg-charcoal-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-5 text-sm font-bold text-charcoal-900 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={Boolean(food.stock && quantity >= food.stock)}
                      className="p-3 text-charcoal-600 hover:bg-charcoal-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-charcoal-400">
                    Total: <strong className="text-charcoal-800">{formatPrice(food.price * quantity)}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`btn-primary btn-lg flex-1 flex items-center justify-center gap-2 ${
                      addedSuccess ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <FiCheck className="w-5 h-5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Add {quantity} to Cart</span>
                      </>
                    )}
                  </button>

                  <Link to="/cart" className="btn-outline btn-lg">
                    View Cart
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-charcoal-100 text-charcoal-600 text-sm font-medium text-center">
                This item is currently sold out or unavailable. Please check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
