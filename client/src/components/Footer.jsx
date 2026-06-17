import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const footerLinks = {
  Services: [
    { to: '/services', label: 'Custom Molding' },
    { to: '/services#prototyping', label: 'Prototyping' },
    { to: '/services#batch', label: 'Small Batch' },
    { to: '/materials', label: 'Materials Guide' },
  ],
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-24">
      <div className="page-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 flex items-center justify-center rounded-sm">
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
            <p className="text-gray-400 font-body text-sm leading-relaxed max-w-xs mb-6">
              Custom mini plastic injection molding for prototypes, small batches, and production runs. Quality parts, fast turnaround.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="mailto:kimsabu36@gmail.com" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                <HiMail size={14} /> kimsabu36@gmail.com
              </a>
              <a href="tel:+251 93 368 0059" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                <HiPhone size={14} /> +251 93 368 0059
              </a>
              <a href="https://maps.app.goo.gl/a8B6TCtZV6Lg7UgT8" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                <HiLocationMarker size={14} /> Addis Ababa, Ethiopia
              </a>
            </div>
            <div className="flex gap-2 mt-6 flex-wrap">
              {[
                { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61590619546219' },
                { icon: FaInstagram, href: 'https://www.instagram.com/moldcraft32' },
                { icon: FaTiktok, href: 'https://tiktok.com/@moldcraft32' },
                { icon: FaLinkedinIn, href: 'https://linkedin.com/company/moldcraft32' },
                { icon: FaXTwitter, href: 'https://x.com/moldcraft32' },
                { icon: FaYoutube, href: 'https://youtube.com/@moldcraft32' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold uppercase tracking-widest text-sm text-white mb-4">{title}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-500 transition-colors font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} MoldCraft. All rights reserved.</span>
          <Link to="/admin" className="hover:text-gray-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
