import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);

      // Determine where to redirect
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/menu', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-warm flex items-center justify-center p-4 sm:p-6">
      <div className="card max-w-md w-full border border-orange-100 shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
            <span>🍽️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal-900">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Log in to manage your canteen orders
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="label" htmlFor="login-email">
              College Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="input pl-11"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0" htmlFor="login-password">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact canteen administration to reset your student password.')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-11"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base py-3 shadow-md mt-2 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="p-0 text-white" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 pt-6 border-t border-charcoal-100 text-center">
          <p className="text-sm text-charcoal-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
