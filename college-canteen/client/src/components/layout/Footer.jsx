import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-charcoal-300 pt-12 pb-8 border-t border-charcoal-800">
      <div className="page-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-charcoal-800">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-display font-bold text-white tracking-wide">
                College Canteen
              </span>
            </div>
            <p className="text-sm text-charcoal-400 max-w-sm">
              Fresh, hygienic, and affordable meals prepared daily for university students and staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link to="/" className="text-charcoal-300 hover:text-primary-400 transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-charcoal-300 hover:text-primary-400 transition-colors">
              Menu
            </Link>
            <Link to="/about" className="text-charcoal-300 hover:text-primary-400 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-charcoal-300 hover:text-primary-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-400">
          <p>© 2024 College Canteen Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made for college students with</span>
            <span className="text-red-500">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
