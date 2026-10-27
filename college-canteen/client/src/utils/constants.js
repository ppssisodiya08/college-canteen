/**
 * utils/constants.js
 * Shared constants used across the frontend.
 * Keeping magic strings in one place makes updates easy.
 */

// Order status values (match the backend Order model exactly)
export const ORDER_STATUS = {
  PENDING:    'Pending',
  CONFIRMED:  'Confirmed',
  PREPARING:  'Preparing',
  READY:      'Ready',
  COMPLETED:  'Completed',
  CANCELLED:  'Cancelled',
};

// Map each status to a Tailwind badge class + display label
export const ORDER_STATUS_STYLE = {
  Pending:   { badge: 'badge-yellow', label: 'Pending' },
  Confirmed: { badge: 'badge-blue',   label: 'Confirmed' },
  Preparing: { badge: 'badge-orange', label: 'Preparing' },
  Ready:     { badge: 'badge-green',  label: 'Ready for Pickup' },
  Completed: { badge: 'badge-gray',   label: 'Completed' },
  Cancelled: { badge: 'badge-red',    label: 'Cancelled' },
};

// Payment methods
export const PAYMENT_METHOD = {
  CASH:    'cash',
  COUNTER: 'counter',
};

// Fallback image when a food item has no image or has an old placeholder image
export const FALLBACK_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

// API base URL — reads from .env (VITE_API_URL) or defaults to /api
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
