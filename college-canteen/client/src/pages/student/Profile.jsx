import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiHash, FiLock, FiCheck, FiSave } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import * as authService from '../../services/authService';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        studentId: user.studentId || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast('Full name is required.', 'error');
      return;
    }

    if (profileData.phone && !/^\d{10}$/.test(profileData.phone.trim())) {
      toast('Phone number must be 10 digits.', 'error');
      return;
    }

    try {
      setSavingProfile(true);
      await updateUser({
        name: profileData.name.trim(),
        studentId: profileData.studentId.trim(),
        phone: profileData.phone.trim(),
      });
      toast('Profile updated successfully!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast('Current and new password are required.', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast('New passwords do not match.', 'error');
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="page-container py-8 sm:py-12">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-8">
        <h1 className="section-title">Account Settings</h1>
        <p className="section-subtitle">
          Manage your personal information and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Card 1: Edit Profile */}
        <div className="card p-6 sm:p-8 border border-charcoal-100 shadow-md">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-charcoal-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center font-bold">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-charcoal-900">
                Personal Details
              </h2>
              <p className="text-xs text-charcoal-500">Update your student contact information</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">College Email (Read Only)</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="input pl-10 bg-charcoal-100/70 text-charcoal-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-charcoal-400 mt-1">
                College email address cannot be changed directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Student ID</label>
                <div className="relative">
                  <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                  <input
                    type="text"
                    value={profileData.studentId}
                    onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                    placeholder="CS-2023-01"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary w-full justify-center mt-4 flex items-center gap-2"
            >
              {savingProfile ? (
                <>
                  <Spinner size="sm" className="p-0 text-white" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card 2: Change Password */}
        <div className="card p-6 sm:p-8 border border-charcoal-100 shadow-md">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-charcoal-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-charcoal-900">
                Security & Password
              </h2>
              <p className="text-xs text-charcoal-500">Update your secret password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Current Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">New Password (min 6 chars) *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm New Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="btn-secondary w-full justify-center mt-4 flex items-center gap-2"
            >
              {changingPassword ? (
                <>
                  <Spinner size="sm" className="p-0 text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
