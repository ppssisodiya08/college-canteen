import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiSave, FiAlertCircle } from 'react-icons/fi';
import * as foodService from '../../services/foodService';
import * as categoryService from '../../services/categoryService';
import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';

export default function AddFood() {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '100',
    preparationTime: '10-15 mins',
    isAvailable: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories({ all: 'true' });
        if (isMounted) {
          const list = res.data?.data || [];
          setCategories(list);
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, category: list[0]._id }));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load categories. Please check database connectivity.');
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.price || !formData.category) {
      setError('Please provide food name, price, and category.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('preparationTime', formData.preparationTime);
      data.append('isAvailable', formData.isAvailable);

      if (imageFile) {
        data.append('image', imageFile);
      }

      await foodService.createFood(data);
      toast('Food created successfully!', 'success');
      setTimeout(() => {
        navigate('/admin/foods');
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create food item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/foods"
          className="p-2 rounded-xl text-charcoal-600 hover:bg-charcoal-100 transition-colors"
          aria-label="Back to food list"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal-900">Add New Food</h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Publish a new dish, snack, or beverage to the canteen menu.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card p-6 sm:p-8 border border-charcoal-100 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group md:col-span-2">
              <label className="label">Dish Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Masala Dosa, Paneer Roll, Cold Coffee"
                className="input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="label">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Delicious crispy dosa served with coconut chutney and hot sambar..."
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.5"
                value={formData.price}
                onChange={handleChange}
                placeholder="50"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Category *</label>
              {loadingCategories ? (
                <div className="input flex items-center gap-2 text-charcoal-400">
                  <Spinner size="sm" className="p-0" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input bg-white cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="label">Daily Stock Units</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="100"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Estimated Prep Time</label>
              <input
                type="text"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="e.g. 10-15 mins"
                className="input"
              />
            </div>

            {/* Image Upload */}
            <div className="form-group md:col-span-2">
              <label className="label">Food Image (Optional)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex-1 w-full border-2 border-dashed border-charcoal-200 hover:border-primary-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-charcoal-50/50 hover:bg-orange-50/20">
                  <FiUploadCloud className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-charcoal-700 block">
                    Click to select an image file
                  </span>
                  <span className="text-xs text-charcoal-400 block mt-1">
                    PNG, JPG, or WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-charcoal-200 bg-white shadow-xs flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-charcoal-200 cursor-pointer hover:bg-charcoal-50 transition-colors">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-400"
                />
                <div>
                  <span className="font-semibold text-sm text-charcoal-900 block">
                    Available for Ordering
                  </span>
                  <span className="text-xs text-charcoal-500 block">
                    When checked, students can add this dish to their cart right away.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-charcoal-100 flex items-center justify-end gap-3">
            <Link to="/admin/foods" className="btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="p-0 text-white" />
                  <span>Saving Food...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Food Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
