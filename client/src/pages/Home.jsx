import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiCube, HiLightningBolt, HiColorSwatch, HiChip } from 'react-icons/hi';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const STATS = [
  { value: '50+', label: 'Parts Produced' },
  { value: '6', label: 'Materials Available' },
  { value: '1–3', label: 'Day Turnaround' },
  { value: '1', label: 'Min. Order Qty' },
];

const SERVICES = [
  {
    icon: HiCube,
    title: 'Custom Parts',
    desc: 'Bring your design to life. We mold any shape that fits our benchtop machine with precision.',
  },
  {
    icon: HiLightningBolt,
    title: 'Rapid Prototyping',
    desc: 'From design file to physical prototype in days, not weeks. Perfect for design validation.',
  },
  {
    icon: HiColorSwatch,
    title: 'Multi-Material',
    desc: 'PP, ABS, HDPE, Nylon, TPU, and more. We help you choose the right plastic for your use case.',
  },
  {
    icon: HiChip,
    title: 'Small Batches',
    desc: 'No massive MOQ. Order just 1 piece or a few hundred — perfect for startups and hobbyists.',
  },
];

const MATERIALS = ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC'];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="page-wrapper relative z-10 py-24">
          <div className="max-w-4xl">
            <motion.div {...fadeUp(0.1)}>
              <span className="section-tag">Mini Injection Molding Studio</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="font-display text-6xl md:text-8xl lg:text-[7rem] font-extrabold uppercase leading-[0.9] tracking-tight text-white mb-8">
              Turning
              <span className="block text-brand-500">Plastic</span>
              Into Precision
            </motion.h1>

            <motion.p {...fadeUp(0.35)} className="font-body text-lg text-gray-400 max-w-xl leading-relaxed mb-10">
              Custom injection-molded parts with no massive minimum orders. We serve prototypers, small manufacturers, hobbyists, and startups who need real plastic parts — fast.
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4">
              <Link to="/quote" className="btn-primary flex items-center gap-2 text-base">
                Get a Free Quote <HiArrowRight />
              </Link>
              <Link to="/gallery" className="btn-secondary flex items-center gap-2 text-base">
                See Our Work
              </Link>
            </motion.div>

            {/* Material pills */}
            <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-2 mt-12">
              <span className="text-xs text-gray-600 uppercase tracking-widest self-center mr-2 font-body">Materials:</span>
              {MATERIALS.map((m) => (
                <span key={m} className="px-3 py-1 text-xs font-mono border border-white/10 text-gray-400 rounded-sm hover:border-brand-500/50 hover:text-brand-400 transition-colors cursor-default">
                  {m}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative vertical text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-brand-500/50" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.5em] text-gray-600 rotate-90 whitespace-nowrap">Injection Molding</span>
          <div className="w-px h-24 bg-gradient-to-t from-transparent to-brand-500/50" />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-y border-white/5 bg-dark-700/30">
        <div className="page-wrapper py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-extrabold text-brand-500">{value}</div>
                <div className="text-sm text-gray-500 font-body uppercase tracking-widest mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="py-24">
        <div className="page-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our Services</h2>
            <div className="divider mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-8 group"
              >
                <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-sm flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={22} className="text-brand-500" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white mb-3">{title}</h3>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/services" className="btn-ghost text-sm font-body font-medium flex items-center gap-2 mx-auto w-fit">
              View all services <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="py-24 bg-dark-700/20 border-y border-white/5">
        <div className="page-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Our Process</h2>
            <div className="divider mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

            {[
              { num: '01', title: 'Submit Your Quote', desc: 'Fill out our quote form with part details, material, and quantity.' },
              { num: '02', title: 'We Review & Quote', desc: 'Our team reviews within 24h and sends you a detailed price quote.' },
              { num: '03', title: 'Mold & Produce', desc: 'Once approved, we set up the mold and run your production.' },
              { num: '04', title: 'Deliver', desc: 'Parts are quality-checked, packaged, and shipped/delivered to you.' },
            ].map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 mx-auto border-2 border-brand-500/30 rounded-sm flex items-center justify-center mb-6 relative z-10 bg-dark-800">
                  <span className="font-display text-3xl font-extrabold text-brand-500">{num}</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="page-wrapper">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-dark-600 border border-brand-500/20 rounded-sm p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.05)_0%,transparent_50%)]" />
            <div className="relative z-10">
              <span className="section-tag">Ready to Build?</span>
              <h2 className="section-title mb-4">Start Your <span className="text-brand-500">Project</span> Today</h2>
              <p className="text-gray-400 font-body max-w-xl mx-auto mb-8">
                Submit a quote request and get a response within 24 hours. No minimum quantity, no hassle.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/quote" className="btn-primary flex items-center gap-2">
                  Request a Quote <HiArrowRight />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Talk to Us First
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
