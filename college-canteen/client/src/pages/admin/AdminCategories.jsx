import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import * as categoryService from '../../services/categoryService';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';

export default function AdminCategories() {
  const { toasts, toast, removeToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add category state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit category modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete category dialog state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categoryService.getCategories({ all: 'true' });
      setCategories(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setAdding(true);
      await categoryService.createCategory({
        name: newName.trim(),
        description: newDesc.trim(),
      });
      toast('Category added successfully!', 'success');
      setNewName('');
      setNewDesc('');
      fetchCategories();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create category.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleOpenEdit = (cat) => {
    setCategoryToEdit(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
    setEditIsActive(cat.isActive !== false);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !categoryToEdit) return;

    try {
      setSavingEdit(true);
      await categoryService.updateCategory(categoryToEdit._id, {
        name: editName.trim(),
        description: editDesc.trim(),
        isActive: editIsActive,
      });
      toast('Category updated successfully!', 'success');
      setEditModalOpen(false);
      setCategoryToEdit(null);
      fetchCategories();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update category.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await categoryService.deleteCategory(categoryToDelete._id);
      toast('Category deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete category.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal-900">Food Categories</h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          Organize menu items by breakfast, beverages, fast food, thalis, etc.
        </p>
      </div>

      {/* Inline Add Category Card */}
      <div className="card p-6 border border-charcoal-100 shadow-sm">
        <h2 className="text-base font-display font-bold text-charcoal-900 mb-4 flex items-center gap-2">
          <FiPlus className="w-5 h-5 text-primary-500" />
          <span>Add New Category</span>
        </h2>

        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="form-group md:col-span-4">
            <label className="label">Category Name *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Snacks, Beverages, Thalis"
              className="input py-2.5 text-sm"
            />
          </div>

          <div className="form-group md:col-span-6">
            <label className="label">Description (Optional)</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Crispy snacks, quick bites, and evening specials..."
              className="input py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="btn-primary w-full justify-center py-2.5 text-sm flex items-center gap-1.5"
            >
              {adding ? (
                <Spinner size="sm" className="p-0 text-white" />
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Create</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="card p-0 border border-charcoal-100 shadow-xs overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <FiAlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchCategories} className="btn-outline btn-sm mt-3">
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <FiFolder className="w-10 h-10 mx-auto text-charcoal-300 mb-2" />
            <p className="text-base font-semibold text-charcoal-800">No categories created</p>
            <p className="text-xs">Add your first food category using the form above.</p>
          </div>
        ) : (
          <>
            {/* ── Mobile card view (< sm) ──────────────────────── */}
            <div className="block sm:hidden divide-y divide-charcoal-100">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-charcoal-900">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-charcoal-500 mt-0.5 line-clamp-2">{cat.description}</p>
                    )}
                    <span className={`badge mt-1.5 ${cat.isActive !== false ? 'badge-green' : 'badge-gray'}`}>
                      {cat.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 text-charcoal-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Edit category"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cat)}
                      className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete category"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table view (≥ sm) ────────────────────── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-charcoal-50 border-b border-charcoal-200 text-xs text-charcoal-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-center">Active Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-charcoal-50/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-charcoal-900">
                        {cat.name}
                      </td>
                      <td className="py-4 px-4 text-xs text-charcoal-500 max-w-sm truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`badge ${cat.isActive !== false ? 'badge-green' : 'badge-gray'}`}>
                          {cat.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 text-charcoal-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            aria-label="Edit category"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(cat)}
                            className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete category"
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
      </div>

      {/* Edit Category Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Category"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="form-group">
            <label className="label">Category Name *</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="input"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editIsActive}
                onChange={(e) => setEditIsActive(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-400"
              />
              <span className="text-sm font-medium text-charcoal-800">
                Mark as Active Category
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-charcoal-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="btn-primary flex items-center gap-2"
            >
              {savingEdit ? <Spinner size="sm" className="p-0 text-white" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? If there are any foods assigned to this category, deletion will be rejected.`}
        confirmText="Delete Category"
        confirmClassName="btn-danger"
        loading={deleting}
      />
    </div>
  );
}
