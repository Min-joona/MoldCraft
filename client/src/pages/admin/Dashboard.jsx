import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { quotesApi, blogApi, galleryApi, dashboardApi, analyticsApi } from '../../api';
import { trackEvent } from '../../hooks/useAnalytics';
import {
  HiClipboardList, HiPhotograph, HiDocumentText, HiLogout, HiClock, HiCheckCircle,
  HiExclamation, HiEye, HiGlobe, HiChartBar, HiTrendingUp, HiCog, HiMail,
  HiPhone, HiTag, HiRefresh, HiCalendar, HiUserGroup, HiChartPie, HiShieldCheck,
} from 'react-icons/hi';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10', reviewing: 'text-blue-400 bg-blue-400/10',
  quoted: 'text-purple-400 bg-purple-400/10', accepted: 'text-green-400 bg-green-400/10',
  rejected: 'text-red-400 bg-red-400/10', completed: 'text-gray-400 bg-gray-400/10',
};

const ROLE_HIERARCHY = { super_admin: 4, admin: 3, editor: 2, developer: 1 };

const NAV_ITEMS = [
  { to: '/admin', icon: HiChartBar, label: 'Dashboard', exact: true },
  { to: '/admin/quotes', icon: HiClipboardList, label: 'Quotes', badge: true },
  { to: '/admin/gallery', icon: HiPhotograph, label: 'Gallery' },
  { to: '/admin/blog', icon: HiDocumentText, label: 'Blog' },
  { to: '/admin/content', icon: HiCog, label: 'Content' },
  { to: '/admin/hero', icon: HiPhotograph, label: 'Hero Slides' },
];



function StatCard({ icon: Icon, label, value, color, trend, onClick }) {
  return (
    <button onClick={onClick} className="card p-5 text-left w-full hover:border-brand-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <Icon size={20} className={color} />
        {trend !== undefined && (
          <span className={`text-xs font-body flex items-center gap-0.5 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <HiTrendingUp className={trend < 0 ? 'rotate-180' : ''} size={12} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`font-display text-2xl font-extrabold ${color}`}>{value ?? '—'}</div>
      <div className="text-xs text-gray-500 uppercase tracking-widest font-body mt-1">{label}</div>
    </button>
  );
}

function MiniBar({ data, height = 60 }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-brand-500/60 rounded-t-sm transition-all hover:bg-brand-500"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
            title={`${d._id || d.country || d.path}: ${d.count}`}
          />
          {data.length <= 14 && (
            <span className="text-[8px] text-gray-600 font-mono leading-none">
              {typeof (d._id || d.country) === 'string' ? (d._id || d.country).slice(0, 3) : ''}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    trackEvent('click', 'logout_button', 'Admin logout');
    logout();
    navigate('/admin/login');
  };

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getStats().then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: () => analyticsApi.getStats().then(r => r.data),
    refetchInterval: 60000,
  });

  const { data: quotesData } = useQuery({
    queryKey: ['quotes', 'recent'],
    queryFn: () => quotesApi.getAll({ limit: 5 }).then(r => r.data),
  });

  const counts = dashData?.counts;
  const analytics = analyticsData;
  const overview = analytics?.overview;

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/5 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-sm flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="14" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="9" rx="1" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="font-display font-bold uppercase tracking-widest text-white text-sm">MoldCraft</span>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-all
                  ${active ? 'bg-brand-500/10 text-brand-500 border-l-2 border-brand-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => { setSidebarOpen(false); trackEvent('click', 'nav_link', item.label); }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <div className="px-3 py-2 text-xs text-gray-500 font-body truncate">Hi, {user?.name}</div>
          <div className="space-y-0.5">
            {user?.role === 'super_admin' && (
              <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors w-full rounded-sm hover:bg-white/5">
                <HiShieldCheck size={14} /> Users
              </Link>
            )}
            <Link to="/admin/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors w-full rounded-sm hover:bg-white/5">
              <HiUserGroup size={14} /> Profile
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors w-full rounded-sm hover:bg-white/5">
              <HiLogout size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-dark-800 border-b border-white/5 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14M3 10h14M3 15h14"/></svg>
          </button>
          <h1 className="font-display font-bold uppercase tracking-widest text-white text-sm lg:text-base hidden sm:block">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-body hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <Link to="/" className="text-xs text-gray-500 hover:text-brand-500 font-body transition-colors" target="_blank">View Site →</Link>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={HiClipboardList} label="Total Quotes" value={counts?.totalQuotes} color="text-brand-500" onClick={() => navigate('/admin/quotes')} />
            <StatCard icon={HiPhotograph} label="Gallery Items" value={counts?.totalGallery} color="text-blue-400" onClick={() => navigate('/admin/gallery')} />
            <StatCard icon={HiDocumentText} label="Blog Posts" value={counts?.totalBlog} color="text-purple-400" onClick={() => navigate('/admin/blog')} />
            <StatCard icon={HiChartBar} label="Page Views (30d)" value={overview?.views30d} color="text-green-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={HiEye} label="Total Views" value={overview?.totalViews} color="text-cyan-400" />
            <StatCard icon={HiGlobe} label="Countries" value={analytics?.countries?.length} color="text-yellow-400" />
            <StatCard icon={HiTag} label="Events (30d)" value={overview?.events30d} color="text-pink-400" />
            <StatCard icon={HiUserGroup} label="Staff Users" value={counts?.totalUsers} color="text-gray-400" />
          </div>

          {/* Analytics Section */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold uppercase tracking-wide text-sm text-white flex items-center gap-2">
                <HiTrendingUp className="text-brand-500" /> Analytics Overview
              </h2>
              <span className="text-xs text-gray-500 font-body">Last 30 days</span>
            </div>
            {analyticsLoading ? (
              <p className="text-center py-8 text-gray-500 font-body text-sm">Loading analytics...</p>
            ) : analytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Views Chart */}
                <div className="lg:col-span-2">
                  <p className="text-xs text-gray-500 font-body mb-2">Daily Page Views</p>
                  <MiniBar data={analytics.dailyViews} />
                  <div className="flex justify-between text-[9px] text-gray-600 font-mono mt-1">
                    <span>{analytics.dailyViews?.[0]?._id}</span>
                    <span>{analytics.dailyViews?.[analytics.dailyViews?.length - 1]?._id}</span>
                  </div>
                </div>
                {/* Top Countries */}
                <div>
                  <p className="text-xs text-gray-500 font-body mb-2">Top Countries</p>
                  <div className="space-y-2">
                    {analytics.countries?.slice(0, 5).map((c, i) => (
                      <div key={c.country} className="flex items-center justify-between">
                        <span className="text-xs text-gray-300 font-body">{c.country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(c.count / analytics.countries[0]?.count) * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 font-mono w-8 text-right">{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500 font-body text-sm">Collecting analytics data... Visit some pages first.</p>
            )}
          </div>

          {/* Top Pages & Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-display font-bold uppercase tracking-wide text-xs text-white mb-3 flex items-center gap-2">
                <HiEye className="text-brand-500" /> Top Pages (30d)
              </h3>
              {analytics?.topPages?.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topPages.map((p, i) => (
                    <div key={p.path} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-300 font-body truncate">{p.path}</span>
                      <span className="text-xs text-gray-500 font-mono shrink-0 ml-2">{p.count} views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-body py-4 text-center">No data yet</p>
              )}
            </div>
            <div className="card p-5">
              <h3 className="font-display font-bold uppercase tracking-wide text-xs text-white mb-3 flex items-center gap-2">
                <HiTag className="text-brand-500" /> Top Events (30d)
              </h3>
              {analytics?.topEvents?.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topEvents.map((e, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-300 font-body">{e.event} {e.element ? `(${e.element})` : ''}</span>
                      <span className="text-xs text-gray-500 font-mono">{e.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-body py-4 text-center">No data yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-display font-bold uppercase tracking-wide text-xs text-white">Recent Quotes</h2>
                <Link to="/admin/quotes" className="text-xs text-brand-500 hover:text-brand-400 font-body">View all →</Link>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {dashLoading && <p className="px-5 py-8 text-center text-gray-500 font-body text-sm">Loading...</p>}
                {!dashLoading && (!dashData?.data?.recentQuotes?.length) && (
                  <div className="px-5 py-8 text-center text-gray-500 font-body text-sm">No quotes yet.</div>
                )}
                {dashData?.data?.recentQuotes?.map(q => (
                  <Link key={q._id} to="/admin/quotes" className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-brand-500 mr-2">{q.quoteNumber}</span>
                      <span className="text-sm text-white font-body">{q.name}</span>
                      <span className="text-xs text-gray-500 ml-1 font-body">{q.material} · {q.quantity}pcs</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-sm font-body font-medium capitalize shrink-0 ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-display font-bold uppercase tracking-wide text-xs text-white">Recent Posts</h2>
                <Link to="/admin/blog" className="text-xs text-brand-500 hover:text-brand-400 font-body">View all →</Link>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {dashLoading && <p className="px-5 py-8 text-center text-gray-500 font-body text-sm">Loading...</p>}
                {!dashLoading && (!dashData?.data?.recentPosts?.length) && (
                  <div className="px-5 py-8 text-center text-gray-500 font-body text-sm">No posts yet.</div>
                )}
                {dashData?.data?.recentPosts?.map(p => (
                  <Link key={p._id} to="/admin/blog" className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm text-white font-body truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 font-body">
                        {p.views} views · {p.isPublished ? 'Published' : 'Draft'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-sm font-body ${p.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>
                      {p.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
