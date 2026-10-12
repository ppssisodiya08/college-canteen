import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiCoffee,
  FiFolder,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
    { label: 'Foods', path: '/admin/foods', icon: FiCoffee },
    { label: 'Categories', path: '/admin/categories', icon: FiFolder },
    { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { label: 'Students', path: '/admin/students', icon: FiUsers },
    { label: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary-500 text-white shadow-sm font-semibold'
        : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
    }`;

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-charcoal-900 text-white z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-charcoal-800">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="font-display font-bold text-base text-white leading-none">
                Admin Panel
              </h1>
              <span className="text-[10px] text-primary-400 font-semibold tracking-wider uppercase">
                College Canteen
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-charcoal-400 hover:text-white p-1"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={linkClass}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <Link
            to="/menu"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <FiExternalLink className="w-4 h-4 text-charcoal-400" />
            <span>View Canteen Store</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-charcoal-200 h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-charcoal-600 hover:bg-charcoal-100"
              aria-label="Open sidebar"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-display font-bold text-charcoal-900">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase">
                {user?.name ? user.name.slice(0, 2) : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-charcoal-800 leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-primary-600 font-medium">Canteen Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
