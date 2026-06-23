import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiKey, HiSave, HiUser } from 'react-icons/hi';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', username: user?.username || '', email: user?.email || '' });

  const pwMut = useMutation({
    mutationFn: d => authApi.updatePassword(d),
    onSuccess: () => { toast.success('Password updated!'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); },
    onError: err => toast.error(err.message),
  });

  const profileMut = useMutation({
    mutationFn: d => authApi.updateProfile(d),
    onSuccess: () => { toast.success('Profile updated!'); refreshUser(); },
    onError: err => toast.error(err.message),
  });

  const handlePwSubmit = (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    pwMut.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileMut.mutate(profileForm);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Profile</h1>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Info */}
        <div className="card p-6">
          <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center gap-2">
            <HiUser className="text-brand-500" /> Profile Info
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="label">Username</label>
                <input value={profileForm.username} onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))} className="input" placeholder="For login without email" />
              </div>
              <div>
                <label className="label">Email</label>
                <input value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} type="email" className="input" required />
              </div>
              <div>
                <label className="label">Role</label>
                <input value={user?.role?.replace('_', ' ')} className="input opacity-60" disabled />
              </div>
            </div>
            <button type="submit" disabled={profileMut.isPending} className="btn-primary text-sm flex items-center gap-2">
              <HiSave size={14} /> {profileMut.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center gap-2">
            <HiKey className="text-brand-500" /> Change Password
          </h2>
          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} type="password" className="input" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">New Password</label>
                <input value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} type="password" className="input" minLength={6} required />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} type="password" className="input" minLength={6} required />
              </div>
            </div>
            <button type="submit" disabled={pwMut.isPending} className="btn-primary text-sm flex items-center gap-2">
              <HiKey size={14} /> {pwMut.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
