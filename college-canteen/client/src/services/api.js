/**
 * services/api.js — Axios Base Instance
 *
 * All API calls in the frontend go through this single Axios instance.
 * This means we only configure base URL, credentials, and interceptors once.
 *
 * Key settings:
 *   baseURL      - Points to our Express API
 *   withCredentials: true - REQUIRED for httpOnly cookies to be sent/received
 *
 * Interceptors:
 *   Request: (nothing needed for now — cookies are automatic)
 *   Response: Catches 401 errors and redirects to /login
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,   // Send cookies with every request (for JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Response Interceptor ──────────────────────────────────────────────────────
// Intercepts responses before they reach the calling code
api.interceptors.response.use(
  // On success (2xx): pass response through unchanged
  (response) => response,

  // On error (4xx, 5xx):
  (error) => {
    const status = error.response?.status;

    // If session expired or unauthorized: force re-login
    if (status === 401) {
      // Only redirect if not already on auth pages
      const isAuthPage = ['/login', '/register'].includes(window.location.pathname);
      if (!isAuthPage) {
        // Clear any stale cart data
        localStorage.removeItem('canteen_cart');
        window.location.href = '/login';
      }
    }

    // Reject the promise so the calling code's .catch() runs
    return Promise.reject(error);
  }
);

export default api;
