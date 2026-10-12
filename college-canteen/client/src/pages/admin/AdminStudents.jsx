import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import * as userService from '../../services/userService';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../utils/formatDate';

export default function AdminStudents() {
  const { toasts, toast, removeToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  const [togglingId, setTogglingId] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();

      const res = await userService.getAllUsers(params);
      setStudents(res.data?.data || []);
      setMeta(res.data?.meta || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve students.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleToggleStatus = async (id) => {
    try {
      setTogglingId(id);
      const res = await userService.toggleUserStatus(id);
      const updatedUser = res.data?.data;
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: updatedUser.isActive } : s))
      );
      toast(res.data?.message || 'Student account status updated!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to change student status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal-900">Registered Students</h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          View registered accounts, verify student identity, and manage access permissions.
        </p>
      </div>

      {/* Search Input */}
      <div className="card p-4 border border-charcoal-100 flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by student name, college email, or student ID..."
          className="w-full text-sm outline-none bg-transparent placeholder-charcoal-400"
        />
      </div>

      {/* Table */}
      <div className="card p-0 border border-charcoal-100 shadow-xs overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <FiAlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchStudents} className="btn-outline btn-sm mt-3">
              Retry
            </button>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <p className="text-base font-semibold text-charcoal-800 mb-1">No students found</p>
            <p className="text-xs">No registered student accounts match your search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal-50 border-b border-charcoal-200 text-xs text-charcoal-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-6 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-charcoal-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-charcoal-900">
                      {student.name}
                    </td>

                    <td className="py-4 px-4 text-charcoal-600">
                      {student.email}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs font-semibold text-charcoal-700">
                      {student.studentId || '—'}
                    </td>

                    <td className="py-4 px-4 text-charcoal-600">
                      {student.phone || '—'}
                    </td>

                    <td className="py-4 px-4 text-xs text-charcoal-500">
                      {formatDate(student.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(student._id)}
                        disabled={togglingId === student._id}
                        className={`badge cursor-pointer transition-all ${
                          student.isActive !== false ? 'badge-green' : 'badge-red'
                        }`}
                        title="Click to toggle account activation status"
                      >
                        {togglingId === student._id ? (
                          'Updating...'
                        ) : student.isActive !== false ? (
                          'Active'
                        ) : (
                          'Deactivated'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-charcoal-100">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}
