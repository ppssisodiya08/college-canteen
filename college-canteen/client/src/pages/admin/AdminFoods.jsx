import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
} from 'react-icons/fi';
import * as foodService from '../../services/foodService';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import { formatPrice } from '../../utils/formatCurrency';
import { FALLBACK_FOOD_IMAGE } from '../../utils/constants';

export default function AdminFoods() {
  const { toasts, toast, removeToast } = useToast();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle availability state
  const [togglingId, setTogglingId] = useState(null);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
      };
      if (search.trim()) params.search = search.trim();

      const res = await foodService.getFoods(params);
      setFoods(res.data?.data || []);
      setMeta(res.data?.meta || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch food items.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleToggleAvailability = async (id) => {
    try {
      setTogglingId(id);
      const res = await foodService.toggleAvailability(id);
      const updatedFood = res.data?.data;
      setFoods((prev) =>
        prev.map((f) => (f._id === id ? { ...f, isAvailable: updatedFood.isAvailable } : f))
      );
      toast(res.data?.message || 'Availability updated successfully!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to toggle availability.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenDelete = (food) => {
    setFoodToDelete(food);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!foodToDelete) return;
    try {
      setDeleting(true);
      await foodService.deleteFood(foodToDelete._id);
      toast('Food item deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setFoodToDelete(null);
      fetchFoods();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete food item.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal-900">Manage Foods</h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Create, update dishes, modify stock levels, and toggle availability.
          </p>
        </div>

        <Link
          to="/admin/foods/add"
          className="btn-primary flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Food</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card p-4 border border-charcoal-100 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search foods by title or description..."
          className="w-full text-sm outline-none bg-transparent placeholder-charcoal-400"
        />
      </div>

      {/* Foods Table / Cards */}
      <div className="card p-0 border border-charcoal-100 shadow-xs overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <FiAlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchFoods} className="btn-outline btn-sm mt-3">
              Retry
            </button>
          </div>
        ) : foods.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <p className="text-base font-semibold text-charcoal-800 mb-1">No food items found</p>
            <p className="text-xs">Try a different search term or add a new dish to the canteen.</p>
          </div>
        ) : (
          <>
            {/* ── Mobile card view (< sm) ──────────────────────── */}
            <div className="block sm:hidden divide-y divide-charcoal-100">
              {foods.map((food) => (
                <div key={food._id} className="p-4 flex items-start gap-3">
                  <img
                    src={food.image || FALLBACK_FOOD_IMAGE}
                    alt={food.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_FOOD_IMAGE; }}
                    className="w-14 h-14 rounded-xl object-cover bg-charcoal-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-charcoal-900 truncate">{food.name}</p>
                    <p className="text-xs text-charcoal-400 line-clamp-1">{food.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="badge badge-gray text-xs">{food.category?.name || 'General'}</span>
                      <span className="font-bold text-primary-600 text-sm">{formatPrice(food.price)}</span>
                      <span className="text-xs text-charcoal-500">Stock: {food.stock}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(food._id)}
                        disabled={togglingId === food._id}
                        className={`badge cursor-pointer transition-all ${food.isAvailable ? 'badge-green' : 'badge-red'}`}
                      >
                        {togglingId === food._id ? 'Updating...' : food.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                      <Link
                        to={`/admin/foods/edit/${food._id}`}
                        className="p-1.5 text-charcoal-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        aria-label="Edit food"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(food)}
                        className="p-1.5 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete food"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table view (≥ sm) ────────────────────── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-charcoal-50 border-b border-charcoal-200 text-xs text-charcoal-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Dish</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {foods.map((food) => (
                    <tr key={food._id} className="hover:bg-charcoal-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={food.image || FALLBACK_FOOD_IMAGE}
                            alt={food.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_FOOD_IMAGE;
                            }}
                            className="w-12 h-12 rounded-xl object-cover bg-charcoal-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-charcoal-900">{food.name}</p>
                            <p className="text-xs text-charcoal-400 line-clamp-1 max-w-xs">
                              {food.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="badge badge-gray text-xs">
                          {food.category?.name || 'General'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-charcoal-900">
                        {formatPrice(food.price)}
                      </td>

                      <td className="py-4 px-4 text-charcoal-700 font-medium">
                        {food.stock}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(food._id)}
                          disabled={togglingId === food._id}
                          className={`badge cursor-pointer transition-all ${
                            food.isAvailable ? 'badge-green' : 'badge-red'
                          }`}
                          title="Click to toggle availability"
                        >
                          {togglingId === food._id ? (
                            'Updating...'
                          ) : food.isAvailable ? (
                            'Available'
                          ) : (
                            'Unavailable'
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/foods/edit/${food._id}`}
                            className="p-2 text-charcoal-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            aria-label="Edit food"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(food)}
                            className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete food"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="p-4 border-t border-charcoal-100">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Food Item"
        message={`Are you sure you want to permanently delete "${foodToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete Dish"
        confirmClassName="btn-danger"
        loading={deleting}
      />
    </div>
  );
}
