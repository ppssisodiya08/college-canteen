import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiShield, FiPackage } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-primary-600 bg-primary-50 font-semibold'
        : 'text-charcoal-700 hover:text-primary-600 hover:bg-charcoal-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-base font-medium px-4 py-2.5 rounded-xl transition-colors ${
      isActive
        ? 'text-primary-600 bg-primary-50 font-semibold'
        : 'text-charcoal-700 hover:bg-charcoal-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-100 shadow-xs">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
              <span>🍽️</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-display font-bold text-gradient">
                College Canteen
              </span>
              <span className="hidden sm:block text-[10px] text-charcoal-400 font-semibold tracking-widest uppercase">
                Campus Dining
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* If admin logged in, show Admin Dashboard button */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="btn-primary btn-sm flex items-center gap-1.5"
              >
                <FiShield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            ) : (
              /* If student or guest, show Cart icon */
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-charcoal-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2.5 rounded-xl border border-charcoal-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-sm font-medium text-charcoal-800"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.slice(0, 2) : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-charcoal-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-charcoal-100">
                      <p className="text-xs text-charcoal-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-charcoal-800 truncate">{user.email}</p>
                    </div>

                    {!isAdmin && (
                      <>
                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-primary-600 transition-colors"
                        >
                          <FiPackage className="w-4 h-4 text-charcoal-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-primary-600 transition-colors"
                        >
                          <FiUser className="w-4 h-4 text-charcoal-400" />
                          <span>Profile</span>
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-primary-600 transition-colors"
                      >
                        <FiShield className="w-4 h-4 text-charcoal-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-charcoal-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-charcoal-700 hover:bg-charcoal-100"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-charcoal-700 hover:bg-charcoal-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-charcoal-100 bg-white space-y-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Menu
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Contact
            </NavLink>

            <div className="border-t border-charcoal-100 pt-3 mt-3">
              {user ? (
                <div className="space-y-1">
                  <div className="px-4 py-2">
                    <p className="text-xs text-charcoal-400">Logged in as</p>
                    <p className="text-sm font-semibold text-charcoal-800">{user.name}</p>
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/cart"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                      >
                        Cart ({itemCount})
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-outline w-full justify-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
