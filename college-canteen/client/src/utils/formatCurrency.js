/**
 * utils/formatCurrency.js
 *
 * Formats a number as Indian Rupees.
 * Example: formatCurrency(149.5) → "₹149.50"
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Formats a number as a short price string.
 * Example: formatPrice(149) → "₹149"
 */
export const formatPrice = (amount) => {
  return `₹${Number(amount || 0).toFixed(2)}`;
};
