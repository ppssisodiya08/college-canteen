import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle, FiHash } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      navigate('/menu', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your info and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-warm flex items-center justify-center p-4 sm:p-6 my-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-orange-100">

        {/* Left: Register Form */}
        <div className="bg-white p-8 sm:p-10 order-2 lg:order-1">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
              <span>🍽️</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal-900">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Register as a college student to order delicious meals
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label" htmlFor="register-name">
                Full Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rohan Sharma"
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="register-email">
                College Email *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rohan@college.edu"
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label" htmlFor="register-studentid">
                  Student ID
                </label>
                <div className="relative">
                  <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="register-studentid"
                    name="studentId"
                    type="text"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="CS-2023-042"
                    className="input pl-11"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="register-phone">
                  Phone Number (10 digits)
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="input pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label" htmlFor="register-password">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input pl-11"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="register-confirm">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input pl-11"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 shadow-md mt-4 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="p-0 text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-charcoal-100 text-center">
            <p className="text-sm text-charcoal-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Food Image Panel */}
        <div className="relative order-1 lg:order-2 min-h-[200px] lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=900&fit=crop"
            alt="Delicious canteen food spread"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent flex flex-col justify-start p-8">
            <div className="text-white space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                🎓 For Students
              </span>
              <h2 className="text-2xl font-display font-bold leading-tight">
                Join 500+ Students <br /> Ordering Smart
              </h2>
              <p className="text-sm text-white/80">
                Skip the queue. Order ahead. Enjoy more.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-[11px] text-white/70">Menu Items</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">10 min</p>
                  <p className="text-[11px] text-white/70">Avg Prep Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
