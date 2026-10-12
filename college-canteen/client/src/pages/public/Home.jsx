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

            {/* Hero Graphic Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="w-full aspect-square rounded-3xl bg-gradient-primary p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white">
                  {/* Background circles */}
                  <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-black/10 blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-4xl">🍲</span>
                    <span className="badge bg-white/20 text-white backdrop-blur-md font-semibold text-xs uppercase px-3 py-1">
                      Campus Favorite
                    </span>
                  </div>

                  <div className="text-center my-auto py-6 z-10">
                    <span className="text-7xl block mb-2 animate-bounce">🍕</span>
                    <h3 className="text-2xl font-display font-bold">Today's Specials</h3>
                    <p className="text-orange-100 text-sm mt-1">Made fresh every morning with quality ingredients</p>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between text-xs z-10">
                    <div>
                      <p className="font-semibold text-white">Canteen Hours Today</p>
                      <p className="text-orange-100">8:00 AM – 8:00 PM</p>
                    </div>
                    <span className="badge bg-green-400 text-green-950 font-bold">Open Now</span>
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
            <div className="bg-charcoal-800/80 rounded-2xl p-6 border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Browse the Menu
              </h3>
              <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed">
                Explore our full list of foods, check real-time availability, and view prices and prep times.
              </p>
            </div>

            <div className="bg-charcoal-800/80 rounded-2xl p-6 border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Add to Cart & Order
              </h3>
              <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed">
                Pick your items, review quantities in your shopping cart, and submit your order instantly.
              </p>
            </div>

            <div className="bg-charcoal-800/80 rounded-2xl p-6 border border-charcoal-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-display font-bold text-lg flex items-center justify-center mb-4">
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
