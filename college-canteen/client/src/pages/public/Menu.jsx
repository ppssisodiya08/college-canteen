import { useState, useEffect, useCallback } from 'react';
import * as foodService from '../../services/foodService';
import * as categoryService from '../../services/categoryService';
import FoodCard from '../../components/food/FoodCard';
import FoodFilter from '../../components/food/FoodFilter';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (isMounted) {
          setCategories(res.data?.data || []);
        }
      } catch (err) {
        // Fail silently for category filter
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch foods whenever filters change
  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 12,
      };
      if (search.trim()) params.search = search.trim();
      if (activeCategory) params.category = activeCategory;
      if (sort) params.sort = sort;

      const res = await foodService.getFoods(params);
      setFoods(res.data?.data || []);
      setMeta(res.data?.meta || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load foods. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, activeCategory, sort]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setPage(1);
  };

  const handleSortChange = (sortVal) => {
    setSort(sortVal);
    setPage(1);
  };

  return (
    <div className="page-container section">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Our Canteen Menu</h1>
        <p className="section-subtitle">
          Discover a wide variety of fresh, delicious dishes made daily.
        </p>

        {/* Food Category Banner */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=200&fit=crop', label: 'Rice & Biryani' },
            { img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=200&fit=crop', label: 'Snacks' },
            { img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop', label: 'Healthy Bowls' },
            { img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=200&fit=crop', label: 'Main Course' },
          ].map(({ img, label }) => (
            <div key={label} className="relative aspect-video rounded-2xl overflow-hidden shadow group cursor-pointer">
              <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter controls */}
      <FoodFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {/* Results content */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : error ? (
        <div className="card text-center py-10 text-red-600">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchFoods}
            className="btn-outline btn-sm mt-4 inline-flex"
          >
            Try Again
          </button>
        </div>
      ) : foods.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No food items found"
          message="We couldn't find any foods matching your criteria. Try adjusting your search or filters."
          action={
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('');
                setSort('');
                setPage(1);
              }}
              className="btn-primary btn-sm"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
