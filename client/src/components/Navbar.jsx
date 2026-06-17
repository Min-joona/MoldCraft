import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/materials', label: 'Materials' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-800/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="page-wrapper flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 flex items-center justify-center rounded-sm group-hover:bg-brand-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="14" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="9" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="12" width="6" height="3" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-widest text-white">
              Mold<span className="text-brand-500">Craft</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-body font-medium uppercase tracking-widest transition-colors duration-200 rounded-sm
                   ${isActive ? 'text-brand-500 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/quote" className="btn-primary text-sm py-2.5 px-5">
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-dark-700/98 backdrop-blur-md border-b border-white/5 lg:hidden"
          >
            <nav className="page-wrapper py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 font-body font-medium uppercase tracking-widest text-sm rounded-sm
                     ${isActive ? 'text-brand-500 bg-brand-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/quote" className="btn-primary text-sm mt-3 text-center">
                Get a Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
