/**
 * utils/foodImages.js
 *
 * Maps food item names to their real Unsplash photo URLs.
 * This ensures food cards always display a beautiful image even if the
 * database still stores an old placeholder URL.
 *
 * Usage:
 *   import { getFoodImage } from '../../utils/foodImages';
 *   const src = getFoodImage(food.name, food.image);
 */

// Keyword → Unsplash image URL mapping
const FOOD_IMAGE_MAP = {
  // ── Fast Food ─────────────────────────────────────────────────────────
  'veg burger':      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'burger':          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'pizza':           'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'french fries':    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
  'fries':           'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',

  // ── Snacks ─────────────────────────────────────────────────────────────
  'paneer roll':     'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  'roll':            'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  'samosa':          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'cheese sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
  'sandwich':        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',

  // ── Main Course ───────────────────────────────────────────────────────
  'masala dosa':     'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
  'dosa':            'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
  'veg fried rice':  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  'fried rice':      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  'rice':            'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  'biryani':         'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
  'noodles':         'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop',
  'pasta':           'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
  'paneer':          'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'curry':           'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'dal':             'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
  'roti':            'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'chapati':         'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',

  // ── Combos / Thali ────────────────────────────────────────────────────
  'veg thali':       'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
  'thali':           'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
  'combo':           'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
  'meal':            'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',

  // ── Beverages ─────────────────────────────────────────────────────────
  'tea':             'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
  'chai':            'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
  'cold coffee':     'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  'coffee':          'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  'fresh lime soda': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'lime soda':       'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'soda':            'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'juice':           'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  'lassi':           'https://images.unsplash.com/photo-1605190557690-5f06d6b56b4c?w=400&h=300&fit=crop',
  'milkshake':       'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=400&h=300&fit=crop',
  'shake':           'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=400&h=300&fit=crop',
  'water':           'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',

  // ── Desserts / Sweets ─────────────────────────────────────────────────
  'cake':            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'ice cream':       'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
  'gulab jamun':     'https://images.unsplash.com/photo-1625497025843-9e47fb7e0b4e?w=400&h=300&fit=crop',
  'halwa':           'https://images.unsplash.com/photo-1625497025843-9e47fb7e0b4e?w=400&h=300&fit=crop',
  'sweet':           'https://images.unsplash.com/photo-1625497025843-9e47fb7e0b4e?w=400&h=300&fit=crop',

  // ── General fallbacks ─────────────────────────────────────────────────
  'salad':           'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'soup':            'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  'bread':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'egg':             'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'snack':           'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
};

// Detect if a URL is a placeholder (placehold.co or similar)
const isPlaceholder = (url) =>
  !url ||
  url.includes('placehold.co') ||
  url.includes('placeholder') ||
  url.trim() === '';

/**
 * Returns the best image URL for a food item.
 * 1. Uses food.image if it's a real (non-placeholder) URL.
 * 2. Otherwise looks up by food name keywords.
 * 3. Falls back to the global FALLBACK_FOOD_IMAGE from constants.
 *
 * @param {string} name  - food item name
 * @param {string} image - image URL stored in the database
 * @param {string} fallback - global fallback from constants
 * @returns {string} best image URL
 */
export function getFoodImage(name = '', image = '', fallback = '') {
  // Use existing real image if available
  if (image && !isPlaceholder(image)) return image;

  // Match by name keywords (longest match first for specificity)
  const lower = name.toLowerCase();
  const keys = Object.keys(FOOD_IMAGE_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) {
      return FOOD_IMAGE_MAP[key];
    }
  }

  // Global fallback
  return fallback || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
}

export default FOOD_IMAGE_MAP;
