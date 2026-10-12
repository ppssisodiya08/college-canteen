import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-warm flex items-center justify-center p-6 text-center">
      <div className="card max-w-md w-full border border-orange-100 shadow-xl p-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-primary-100 text-primary-600 flex items-center justify-center text-4xl mb-4 shadow-xs">
          🍽️
        </div>
        <span className="text-6xl font-display font-extrabold text-primary-500 mb-2">
          404
        </span>
        <h1 className="text-2xl font-display font-bold text-charcoal-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-charcoal-500 max-w-xs mb-8 leading-relaxed">
          Oops! The page or food dish you are looking for doesn't exist or might have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link to="/" className="btn-primary w-full justify-center flex items-center gap-2">
            <FiHome className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link to="/menu" className="btn-outline w-full justify-center flex items-center gap-2">
            <FiCompass className="w-4 h-4" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
