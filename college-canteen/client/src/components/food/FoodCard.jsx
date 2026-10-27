import { Link } from 'react-router-dom';
import { FiPlus, FiClock } from 'react-icons/fi';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';
import { getFoodImage } from '../../utils/foodImages';
import { formatPrice } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  if (!food) return null;

  const isOutOfStock = food.stock === 0 || food.isAvailable === false;
  const categoryName = food.category?.name || (typeof food.category === 'string' ? food.category : 'General');

  // Resolve real image: use DB image if real, else match by food name, else fallback
  const resolvedImage = getFoodImage(food.name, food.image, FALLBACK_FOOD_IMAGE);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_FOOD_IMAGE;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(food, 1);
  };

  return (
    <div className="card-hover flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-charcoal-100/80 group">
      {/* Image container */}
      <Link to={`/menu/${food._id}`} className="relative block aspect-video sm:aspect-4/3 overflow-hidden bg-charcoal-100">
        <img
          src={resolvedImage}
          alt={food.name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Category Pill Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className="badge bg-white/90 text-charcoal-800 backdrop-blur-xs font-semibold shadow-xs">
            {categoryName}
          </span>
        </div>

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="badge badge-red font-bold text-xs uppercase px-3 py-1.5 shadow-md">
              {food.stock === 0 ? 'Out of Stock' : 'Currently Unavailable'}
            </span>
          </div>
        )}

        {/* Prep time badge bottom-right */}
        {food.preparationTime && !isOutOfStock && (
          <div className="absolute bottom-3 right-3 bg-charcoal-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
            <FiClock className="w-3 h-3 text-primary-400" />
            <span>{food.preparationTime}</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/menu/${food._id}`} className="block">
            <h3 className="font-display font-bold text-lg text-charcoal-900 hover:text-primary-600 transition-colors line-clamp-1 mb-1">
              {food.name}
            </h3>
          </Link>
          <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed mb-4">
            {food.description || 'Delicious, fresh and freshly prepared for you.'}
          </p>
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between pt-3 border-t border-charcoal-100 mt-auto">
          <div>
            <span className="text-xs text-charcoal-400 font-medium block">Price</span>
            <span className="text-lg font-bold font-display text-primary-600">
              {formatPrice(food.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white hover:shadow-md'
            }`}
            aria-label={`Add ${food.name} to cart`}
          >
            <FiPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
