import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { usePageTracking } from './hooks/useAnalytics';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Quote from './pages/Quote';
import Materials from './pages/Materials';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminQuotes from './pages/admin/Quotes';
import AdminGallery from './pages/admin/GalleryManager';
import AdminBlog from './pages/admin/BlogManager';
import ContentManager from './pages/admin/ContentManager';
import UsersManager from './pages/admin/UsersManager';
import Profile from './pages/admin/Profile';
import HeroCarouselAdmin from './pages/admin/HeroCarousel';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => {
  usePageTracking();
  return (
    <div className="min-h-screen flex flex-col noise">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/quote" element={<PublicLayout><Quote /></PublicLayout>} />
      <Route path="/materials" element={<PublicLayout><Materials /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/quotes" element={<ProtectedRoute><AdminQuotes /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><UsersManager /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/hero" element={<ProtectedRoute><HeroCarouselAdmin /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<PublicLayout><div className="flex items-center justify-center min-h-[60vh] flex-col gap-4"><span className="font-display text-8xl font-bold text-brand-500">404</span><p className="text-gray-400">Page not found</p><a href="/" className="btn-primary">Go Home</a></div></PublicLayout>} />
    </Routes>
  );
}
