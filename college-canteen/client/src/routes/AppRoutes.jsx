import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import Menu from '../pages/public/Menu';
import FoodDetail from '../pages/public/FoodDetail';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';

// Student Pages
import Cart from '../pages/student/Cart';
import Checkout from '../pages/student/Checkout';
import OrderSuccess from '../pages/student/OrderSuccess';
import MyOrders from '../pages/student/MyOrders';
import OrderDetail from '../pages/student/OrderDetail';
import Profile from '../pages/student/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminFoods from '../pages/admin/AdminFoods';
import AddFood from '../pages/admin/AddFood';
import EditFood from '../pages/admin/EditFood';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminReports from '../pages/admin/AdminReports';

/**
 * ProtectedRoute: Allows only authenticated students and users
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

/**
 * AdminRoute: Allows only users with role === 'admin'
 */
function AdminRoute({ children, title }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/menu" replace />;
  }

  return <AdminLayout title={title}>{children}</AdminLayout>;
}

/**
 * PublicRoute: Wraps in MainLayout, redirects away from auth pages if logged in
 */
function PublicRoute({ children, redirectIfAuth = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (redirectIfAuth && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/menu'} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ──────────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <PublicRoute>
            <Menu />
          </PublicRoute>
        }
      />
      <Route
        path="/menu/:id"
        element={
          <PublicRoute>
            <FoodDetail />
          </PublicRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PublicRoute>
            <About />
          </PublicRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicRoute>
            <Contact />
          </PublicRoute>
        }
      />

      {/* ── Auth Routes (Redirect if already logged in) ────────────────── */}
      <Route
        path="/login"
        element={
          <PublicRoute redirectIfAuth={true}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute redirectIfAuth={true}>
            <Register />
          </PublicRoute>
        }
      />

      {/* ── Student Protected Routes ───────────────────────────────────── */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ── Admin Protected Routes ─────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <AdminRoute title="Dashboard">
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/foods"
        element={
          <AdminRoute title="Food Management">
            <AdminFoods />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/foods/add"
        element={
          <AdminRoute title="Add New Food">
            <AddFood />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/foods/edit/:id"
        element={
          <AdminRoute title="Edit Food Item">
            <EditFood />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute title="Category Management">
            <AdminCategories />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute title="Order Management">
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminRoute title="Registered Students">
            <AdminStudents />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute title="Sales & Performance Reports">
            <AdminReports />
          </AdminRoute>
        }
      />

      {/* ── 404 Not Found ──────────────────────────────────────────────── */}
      <Route
        path="*"
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        }
      />
    </Routes>
  );
}
