import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi';
import * as foodService from '../../services/foodService';
import FoodCard from '../../components/food/FoodCard';
import Spinner from '../../components/common/Spinner';

export default function Home() {
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const res = await foodService.getFoods({ limit: 6, sort: 'newest' });
        if (isMounted) {
          setPopularFoods(res.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load popular foods');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-warm border-b border-orange-100/60 py-16 sm:py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold tracking-wide uppercase">
                <span>🚀</span> Faster Service & Fresh Meals
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-charcoal-900 tracking-tight leading-tight">
                Fresh & Delicious <br />
                <span className="text-gradient">Canteen Food</span> at Campus
              </h1>

              <p className="text-base sm:text-lg text-charcoal-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Skip long queues between lectures! Browse daily specials, order your meals online in seconds, and pick up hot food freshly served at the counter.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/menu" className="btn-primary btn-lg w-full sm:w-auto text-center shadow-md hover:shadow-lg">
                  Order Now <FiArrowRight className="w-5 h-5 ml-1" />
                </Link>
                <Link to="/menu" className="btn-outline btn-lg w-full sm:w-auto text-center">
                  View Full Menu
                </Link>
              </div>

              {/* Mini trust stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-charcoal-200/60 text-charcoal-700 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold font-display text-charcoal-900">50+</div>
                  <div className="text-xs text-charcoal-500">Menu Items</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-charcoal-900">10 min</div>
                  <div className="text-xs text-charcoal-500">Avg. Prep Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-charcoal-900">100%</div>
                  <div className="text-xs text-charcoal-500">Hygienic Prep</div>
                </div>
              </div>
            </div>

            {/* Hero Graphic Card – Real Food Image Collage */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2 border border-orange-100">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">4.9 Rating</p>
                    <p className="text-[10px] text-charcoal-400">500+ Happy Students</p>
                  </div>
                </div>

                {/* Floating open badge */}
                <div className="absolute -bottom-4 -left-4 z-20 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2 border border-green-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse block"></span>
                  <div>
                    <p className="text-xs font-bold text-green-700">Open Now</p>
                    <p className="text-[10px] text-charcoal-400">8:00 AM – 8:00 PM</p>
                  </div>
                </div>

                {/* 2x2 Image Grid */}
                <div className="grid grid-cols-2 gap-3 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop"
                      alt="Delicious biryani"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Biryani</div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
                      alt="Fresh pizza"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Pizza</div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop"
                      alt="Samosa snacks"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Snacks</div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop"
                      alt="Fresh meals"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Today's Special</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-title">Why Order With Us?</h2>
          <p className="section-subtitle">
            Designed specifically for student convenience, fast pick-ups, and wholesome meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-hover text-center p-8 rounded-2xl border border-charcoal-100">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-primary-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-xs">
              🍽️
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal-900 mb-2">
              Fresh Food Daily
            </h3>
            <p className="text-charcoal-600 text-sm leading-relaxed">
              Wholesome snacks, meals, and beverages prepared fresh on campus every single day using sanitary practices.
            </p>
          </div>

          <div className="card-hover text-center p-8 rounded-2xl border border-charcoal-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-xs">
              ⚡
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal-900 mb-2">
              Quick Service
            </h3>
            <p className="text-charcoal-600 text-sm leading-relaxed">
              Order from class or your hostel, track live status, and collect your food without waiting in queues.
            </p>
          </div>

          <div className="card-hover text-center p-8 rounded-2xl border border-charcoal-100">
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-xs">
              💳
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal-900 mb-2">
              Easy Payment at Counter
            </h3>
            <p className="text-charcoal-600 text-sm leading-relaxed">
              Simple cash or UPI payment directly at the counter upon order verification and collection.
            </p>
          </div>
        </div>
      </section>

      {/* ── Popular Items Section ────────────────────────────────────────── */}
      <section className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">Popular Items</h2>
            <p className="section-subtitle">
              Most loved snacks and meals among students this week.
            </p>
          </div>
          <Link to="/menu" className="btn-outline btn-sm self-start sm:self-auto flex items-center gap-1">
            <span>View Full Menu</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-16" />
        ) : error ? (
          <div className="card text-center py-8 text-red-600 text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* ── How It Works Section ─────────────────────────────────────────── */}
      <section className="bg-charcoal-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-8">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge bg-primary-500/20 text-primary-400 font-bold uppercase text-xs tracking-wider mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2">
              How It Works
            </h2>
            <p className="text-charcoal-400 text-sm sm:text-base mt-2">
              Get your hot food in three easy steps without ever waiting in the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-charcoal-800/80 rounded-2xl overflow-hidden border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-full h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=200&fit=crop"
                  alt="Browse the menu"
                  className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4 mx-auto -mt-10 relative z-10 shadow-lg border-2 border-charcoal-800">
                  1
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Browse the Menu
                </h3>
                <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed">
                  Explore our full list of foods, check real-time availability, and view prices and prep times.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-800/80 rounded-2xl overflow-hidden border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-full h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=200&fit=crop"
                  alt="Add to cart"
                  className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4 mx-auto -mt-10 relative z-10 shadow-lg border-2 border-charcoal-800">
                  2
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Add to Cart & Order
                </h3>
                <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed">
                  Pick your items, review quantities in your shopping cart, and submit your order instantly.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-800/80 rounded-2xl overflow-hidden border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-full h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=200&fit=crop"
                  alt="Pick up and enjoy"
                  className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4 mx-auto -mt-10 relative z-10 shadow-lg border-2 border-charcoal-800">
                  3
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Pick Up & Enjoy
                </h3>
                <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed">
                  Show your order token at the canteen pick-up counter, pay, and grab your delicious meal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      <section className="page-container">
        <div className="rounded-3xl bg-gradient-primary text-white p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Hungry? Place Your Order Now!
            </h2>
            <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
              Don't spend your break waiting in line. Explore what's cooking right now and pick up when ready.
            </p>
            <div className="pt-2">
              <Link to="/menu" className="btn-secondary btn-lg bg-white text-charcoal-900 hover:bg-orange-50 font-bold shadow-md">
                View Full Menu & Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
