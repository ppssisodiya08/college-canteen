import { FiClock, FiHeart, FiSmile, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-warm py-16 sm:py-20 border-b border-orange-100">
        <div className="page-container text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-semibold uppercase tracking-wider">
            <span>🥗</span> About Our Campus Canteen
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-charcoal-900">
            Nourishing Minds & Campus Life
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
            We are dedicated to providing wholesome, high-quality, and affordable meals that fuel learning, friendships, and everyday campus memories.
          </p>
        </div>
      </section>

      {/* Food Photo Strip */}
      <section className="page-container -mt-4">
        <div className="grid grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-md">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop" alt="Fresh salad" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=250&fit=crop" alt="Biryani" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop" alt="Samosa" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop" alt="Hot meals" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </section>

      <section className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-900">
              Our Mission
            </h2>
            <p className="text-charcoal-600 leading-relaxed text-sm sm:text-base">
              The College Canteen was established to eliminate hunger on campus by offering student-friendly pricing, clean cooking environments, and nutritious meal options tailored for busy academic schedules.
            </p>
            <p className="text-charcoal-600 leading-relaxed text-sm sm:text-base">
              With our digital ordering platform, students can save time between classes, avoid standing in long lines, and receive hot food right on time.
            </p>
            <div className="pt-2">
              <Link to="/menu" className="btn-primary">
                Explore What We Offer
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* Canteen Photo */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img
                src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=700&h=400&fit=crop"
                alt="Fresh food at the campus canteen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-semibold">🍽️ Fresh, hygienic meals prepared daily</p>
              </div>
            </div>

            <div className="card bg-white p-8 border border-charcoal-100 shadow-md">
              <h3 className="text-xl font-display font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-primary-500" />
                <span>Canteen Operating Hours</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-charcoal-100">
                  <span className="font-semibold text-charcoal-800">Monday – Friday</span>
                  <span className="badge badge-green font-semibold">8:00 AM – 8:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-charcoal-100">
                  <span className="font-semibold text-charcoal-800">Saturday</span>
                  <span className="badge badge-blue font-semibold">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-charcoal-800">Sunday & Holidays</span>
                  <span className="badge badge-gray font-semibold">Closed / Special Events</span>
                </div>
              </div>

              <p className="text-xs text-charcoal-500 mt-6 pt-4 border-t border-charcoal-100">
                * Hot breakfast is served until 11:00 AM. Lunch begins at 12:00 PM daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Features */}
      <section className="page-container">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="section-title">What Defines Us</h2>
          <p className="section-subtitle">Core standards that we bring to every plate</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center p-6 border border-charcoal-100">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FiAward className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-charcoal-900 mb-2">High Standards</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Strict hygiene protocols, food-grade prep surfaces, and fresh daily sourcing.
            </p>
          </div>

          <div className="card text-center p-6 border border-charcoal-100">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FiHeart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-charcoal-900 mb-2">Student Friendly</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Pocket-friendly prices and generous portions keeping student budgets in mind.
            </p>
          </div>

          <div className="card text-center p-6 border border-charcoal-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FiSmile className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-charcoal-900 mb-2">Varied Menu</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              From morning tea & samosas to wholesome lunch thalis and evening bites.
            </p>
          </div>

          <div className="card text-center p-6 border border-charcoal-100">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FiClock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-charcoal-900 mb-2">Fast Turnaround</h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Organized kitchen workflows so you get freshly prepared food within 10-15 mins.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
