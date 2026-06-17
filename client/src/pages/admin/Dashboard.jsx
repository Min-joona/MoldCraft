import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { quotesApi } from '../../api';
import { HiClipboardList, HiPhotograph, HiDocumentText, HiLogout, HiClock, HiCheckCircle, HiExclamation } from 'react-icons/hi';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  reviewing: 'text-blue-400 bg-blue-400/10',
  quoted: 'text-purple-400 bg-purple-400/10',
  accepted: 'text-green-400 bg-green-400/10',
  rejected: 'text-red-400 bg-red-400/10',
  completed: 'text-gray-400 bg-gray-400/10',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: quotesData } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => quotesApi.getAll({ limit: 5 }).then((r) => r.data),
  });

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const stats = quotesData ? [
    { label: 'Total Quotes', value: quotesData.total, icon: HiClipboardList, color: 'text-brand-500' },
    { label: 'Pending', value: quotesData.data?.filter((q) => q.status === 'pending').length, icon: HiClock, color: 'text-yellow-400' },
    { label: 'Accepted', value: quotesData.data?.filter((q) => q.status === 'accepted').length, icon: HiCheckCircle, color: 'text-green-400' },
    { label: 'Needs Attention', value: quotesData.data?.filter((q) => q.status === 'pending').length, icon: HiExclamation, color: 'text-red-400' },
  ] : [];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Admin Navbar */}
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="14" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="9" rx="1" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-display font-bold uppercase tracking-widest text-white">MoldCraft Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-body">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <HiLogout /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-8">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-6">
              <Icon size={20} className={`${color} mb-3`} />
              <div className={`font-display text-3xl font-extrabold ${color}`}>{value ?? '—'}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-body mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { to: '/admin/quotes', icon: HiClipboardList, label: 'Manage Quotes', desc: 'View and update quote requests' },
            { to: '/admin/gallery', icon: HiPhotograph, label: 'Gallery Manager', desc: 'Upload and organize portfolio items' },
            { to: '/admin/blog', icon: HiDocumentText, label: 'Blog Manager', desc: 'Write and publish blog posts' },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="card-hover p-6 flex gap-4 items-start">
              <Icon size={22} className="text-brand-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-display font-bold uppercase tracking-wide text-sm text-white mb-1">{label}</div>
                <div className="text-xs text-gray-500 font-body">{desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Quotes */}
        <div className="card">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-display font-bold uppercase tracking-wide text-sm text-white">Recent Quotes</h2>
            <Link to="/admin/quotes" className="text-xs text-brand-500 hover:text-brand-400 font-body">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {quotesData?.data?.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 font-body text-sm">No quotes yet.</div>
            )}
            {quotesData?.data?.map((q) => (
              <Link key={q._id} to={`/admin/quotes`} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
                <div>
                  <span className="font-mono text-xs text-brand-500 mr-3">{q.quoteNumber}</span>
                  <span className="text-sm text-white font-body">{q.name}</span>
                  <span className="text-xs text-gray-500 ml-2 font-body">{q.material} · {q.quantity} pcs</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-sm font-body font-medium capitalize ${STATUS_COLORS[q.status]}`}>{q.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
