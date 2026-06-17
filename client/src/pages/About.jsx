import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const TEAM = [
  { name: 'Abenezer', role: 'Co-founder & Operations', bio: 'Handles machine operation, mold setup, and quality control.' },
  { name: 'Amar Hassen Mohammednur', role: 'Co-founder & IT / Digital', bio: 'Manages the website, social media, ads, and online presence.' },
  { name: 'Kebrom', role: 'Co-founder & Sales', bio: 'Handles customer relations, pricing, and business development.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Material Prep', desc: 'Plastic pellets are dried and prepared to remove moisture, which affects part quality.' },
  { num: '02', title: 'Heating', desc: 'Pellets are fed into the heated barrel where they melt to the correct viscosity for injection.' },
  { num: '03', title: 'Injection', desc: 'Molten plastic is injected into the closed mold cavity under pressure using our lever machine.' },
  { num: '04', title: 'Cooling', desc: 'The plastic solidifies as it cools inside the mold, taking the exact shape of the cavity.' },
  { num: '05', title: 'Ejection', desc: 'The mold opens and the finished part is ejected. The cycle can repeat in seconds to minutes.' },
  { num: '06', title: 'QC & Delivery', desc: 'Parts are inspected for defects, trimmed if needed, packaged, and delivered.' },
];

export default function About() {
  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="page-wrapper mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <span className="section-tag">Our Story</span>
          <h1 className="section-title mb-4">About MoldCraft</h1>
          <div className="divider mb-8" />
          <p className="text-gray-300 font-body text-lg leading-relaxed mb-4">
            MoldCraft started as a student project between friends who saw a gap: most plastic injection molding services have huge minimum orders, long lead times, and are priced for large factories — not small creators, startups, or hobbyists.
          </p>
          <p className="text-gray-400 font-body leading-relaxed">
            We set up a benchtop mini injection molding machine and started producing real plastic parts for people who needed low quantities fast. What began as an experiment turned into a real business. We're still small — and that's our strength. We're fast, personal, and genuinely care about every part we make.
          </p>
        </motion.div>
      </section>

      {/* Equipment */}
      <section className="bg-dark-700/30 border-y border-white/5 py-24 mb-24">
        <div className="page-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-tag">Our Setup</span>
            <h2 className="section-title mb-10">Equipment</h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                {[
                  { label: 'Machine type', value: 'Manual benchtop injection molding machine' },
                  { label: 'Max shot size', value: 'Small parts up to ~50g per shot' },
                  { label: 'Clamping force', value: 'Suitable for small to medium molds' },
                  { label: 'Temperature control', value: 'Digital PID controller' },
                  { label: 'Mold material', value: 'Aluminum, mild steel, or 3D-printed' },
                  { label: 'Compatible materials', value: 'PP, ABS, HDPE, Nylon, TPU, PC, PVC' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-500 text-sm font-body uppercase tracking-wider">{label}</span>
                    <span className="text-gray-300 text-sm font-body text-right ml-6 max-w-[200px]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="card p-8 text-center">
                <div className="w-24 h-24 bg-brand-500/10 border-2 border-brand-500/20 rounded-sm flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="4" y="2" width="14" height="36" rx="2" fill="#f97316" opacity="0.7"/>
                    <rect x="22" y="2" width="14" height="22" rx="2" fill="#f97316" opacity="0.4"/>
                    <rect x="22" y="28" width="14" height="10" rx="2" fill="#f97316" opacity="0.2"/>
                    <line x1="4" y1="20" x2="38" y2="20" stroke="#f97316" strokeWidth="0.5" opacity="0.3"/>
                  </svg>
                </div>
                <p className="text-gray-400 font-body text-sm leading-relaxed">
                  Our machine uses a lever-operated plunger system with a digital temperature controller, capable of producing consistent parts across multiple materials.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="page-wrapper mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-tag">How It Works</span>
          <h2 className="section-title mb-12">The Injection Molding Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROCESS_STEPS.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6"
              >
                <span className="font-mono text-xs text-brand-500 block mb-3">{num}</span>
                <h3 className="font-display font-bold uppercase tracking-wide text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="page-wrapper mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-tag">The People</span>
          <h2 className="section-title mb-10">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, bio }) => (
              <div key={role} className="card p-8">
                <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-sm flex items-center justify-center mb-6">
                  <span className="font-display text-2xl font-bold text-brand-500">{name.charAt(0)}</span>
                </div>
                <h3 className="font-display font-bold uppercase tracking-wide text-white mb-1">{name}</h3>
                <p className="text-xs text-brand-500 font-body uppercase tracking-widest mb-3">{role}</p>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm font-body mt-4">* Update team names, roles, and photos once you're ready.</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="page-wrapper">
        <div className="bg-dark-600 border border-brand-500/20 rounded-sm p-10 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-3">Work With Us</h2>
          <p className="text-gray-400 font-body mb-6">Have a project in mind? Let's talk about it.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quote" className="btn-primary inline-flex items-center gap-2">Get a Quote <HiArrowRight /></Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
