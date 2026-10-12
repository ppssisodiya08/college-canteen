/**
 * utils/generateOrderNumber.js — Order Number Generator
 *
 * Generates a unique, human-readable order number like: CC-20241015-A3F7
 *
 * Format: CC-YYYYMMDD-XXXX
 *   CC   = Canteen Code (prefix)
 *   YYYYMMDD = today's date
 *   XXXX = 4-character uppercase alphanumeric random suffix
 *
 * This is stored in the Order document and shown to students on receipts.
 */

const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate a 4-character random alphanumeric string
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0, O, 1, I)
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `CC-${dateStr}-${suffix}`;
};

module.exports = generateOrderNumber;
