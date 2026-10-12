import { FiSearch, FiSliders } from 'react-icons/fi';

export default function FoodFilter({
  categories = [],
  activeCategory = '',
  onCategoryChange,
  search = '',
  onSearchChange,
  sort = '',
  onSortChange,
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search foods (e.g., Samosa, Chai, Burger)..."
            className="input pl-11 py-2.5 text-sm"
          />
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <FiSliders className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="input pl-9 pr-8 py-2.5 text-sm bg-white cursor-pointer appearance-none"
              aria-label="Sort foods"
            >
              <option value="">Sort: Default</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Scrollable Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeCategory === ''
              ? 'bg-primary-500 text-white shadow-sm font-semibold'
              : 'bg-white text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => onCategoryChange(cat._id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat._id
                ? 'bg-primary-500 text-white shadow-sm font-semibold'
                : 'bg-white text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
