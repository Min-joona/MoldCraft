import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiPlus, HiTrash, HiPencil, HiX, HiShieldCheck, HiUserCircle } from 'react-icons/hi';

const ROLE_COLORS = {
  super_admin: 'text-red-400 bg-red-400/10 border-red-400/20',
  admin: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
  editor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  developer: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const ROLE_DESCRIPTIONS = {
  super_admin: 'Full access — manage users, settings, everything',
  admin: 'Manage quotes, gallery, blog, analytics, content',
  editor: 'Manage blog posts and gallery only',
  developer: 'Access content manager and technical settings',
};

export default function UsersManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'editor' });

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getUsers().then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: d => authApi.createUser(d),
    onSuccess: () => { toast.success('User created!'); qc.invalidateQueries(['users']); closeForm(); },
    onError: err => toast.error(err.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => authApi.updateUser(id, data),
    onSuccess: () => { toast.success('User updated!'); qc.invalidateQueries(['users']); closeForm(); },
    onError: err => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: id => authApi.deleteUser(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['users']); },
    onError: err => toast.error(err.message),
  });

  const closeForm = () => { setShowForm(false); setEditing(null); setForm({ name: '', username: '', email: '', password: '', role: 'editor' }); };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, username: u.username || '', email: u.email, password: '', role: u.role });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email required');
    if (!editing && !form.password) return toast.error('Password required for new users');
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <HiShieldCheck size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-white text-xl mb-2">Access Denied</h2>
          <p className="text-gray-400 font-body text-sm">Only super admins can manage users.</p>
          <Link to="/admin" className="btn-primary text-sm mt-6 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">User Management</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', username: '', email: '', password: '', role: 'editor' }); setShowForm(true); }}
          className="ml-auto btn-primary text-xs py-2 flex items-center gap-1.5">
          <HiPlus size={14} /> Add User
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center justify-between">
              {editing ? 'Edit User' : 'New User'}
              <button onClick={closeForm} className="text-gray-500 hover:text-white"><HiX /></button>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="Full name" required />
                </div>
                <div>
                  <label className="label">Username</label>
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="input" placeholder="For login without email" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="input" placeholder="email@example.com" required />
                </div>
                <div>
                  <label className="label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" className="input" placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="input">
                    <option value="editor">Editor — content only</option>
                    <option value="developer">Developer — technical content</option>
                    <option value="admin">Admin — full management</option>
                    <option value="super_admin">Super Admin — everything</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1 font-body">{ROLE_DESCRIPTIONS[form.role]}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary text-sm">
                  {editing ? 'Update User' : 'Create User'}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <p className="text-center py-12 text-gray-500 font-body">Loading...</p>
        ) : (
          <div className="space-y-3">
            {data?.map(u => (
              <div key={u.id} className="card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <HiUserCircle size={36} className="text-gray-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body font-medium text-white">{u.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-sm border font-body ${ROLE_COLORS[u.role]}`}>{u.role.replace('_', ' ')}</span>
                      {!u.isActive && <span className="text-xs px-2 py-0.5 rounded-sm border text-red-400 bg-red-400/10 border-red-400/20 font-body">Inactive</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-body mt-0.5">
                      {u.username && <><span className="text-gray-400">{u.username}</span> · </>}{u.email}
                    </p>
                    <p className="text-xs text-gray-600 font-body">{ROLE_DESCRIPTIONS[u.role]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(u)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit"><HiPencil size={16} /></button>
                  {u.id !== user?.id && (
                    <button onClick={() => { if (window.confirm(`Delete ${u.name}?`)) deleteMut.mutate(u.id); }}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Delete"><HiTrash size={16} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
