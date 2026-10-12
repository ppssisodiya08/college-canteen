/**
 * App.jsx — Root Application Component
 *
 * This component:
 * 1. Wraps the whole app in Context providers (AuthContext, CartContext)
 * 2. Sets up React Router with BrowserRouter
 * 3. Defines all application routes
 *
 * Phase 1: We render a simple placeholder to verify Tailwind + Vite work.
 * Routes and context providers will be added in Phase 5.
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
