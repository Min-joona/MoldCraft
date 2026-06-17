import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

const SERVICES = [
  {
    id: 'custom',
    tag: '01',
    title: 'Custom Injection Molding',
    desc: 'Turn your design into a real plastic part. We work with your drawings, CAD files, or even rough sketches to produce custom molded parts on our benchtop machine.',
    features: ['Low minimum quantity (even 1 piece)', 'Multiple material options', 'Custom colors', 'Tight tolerances for small parts', 'Sample approval before full run'],
    cta: '/quote',
  },
  {
    id: 'proto',
    tag: '02',
    title: 'Rapid Prototyping',
    desc: 'Skip the 3D-printed look. Get real injection-molded prototypes in the actual material your final product will use — crucial for functional testing and investor demos.',
    features: ['Real material properties', 'Faster than outsourcing abroad', 'Iterate quickly with low cost', 'Ideal before going to mass production', 'Visual and functional grade available'],
    cta: '/quote',
  },
  {
    id: 'batch',
    tag: '03',
    title: 'Small Batch Production',
    desc: 'Need more than a prototype but less than a factory run? We handle small production batches from tens to a few thousand pieces — the sweet spot big factories ignore.',
    features: ['10 to 2,000+ pieces per run', 'Consistent quality shot-to-shot', 'We store your mold for repeat orders', 'Volume discounts available', 'Packaging and labeling options'],
    cta: '/quote',
  },
  {
    id: 'consult',
    tag: '04',
    title: 'Mold Design Consultation',
    desc: "Not sure if your part is mouldable? We review your design for DFM (Design for Manufacturability) and advise on wall thickness, draft angles, and material choice before you commit.",
    features: ['Free for serious quote requests', 'DFM feedback on your design', 'Wall thickness recommendations', 'Draft angle analysis', 'Material matching for your use case'],
    cta: '/contact',
  },
];

const PRICING = [
  { label: 'Per-shot cost', note: 'Depends on material and part size. PP/HDPE are most affordable; PC/Nylon are higher.' },
  { label: 'Mold setup', note: 'One-time cost if we need to make a new mold. Waived if you have your own mold.' },
  { label: 'Volume discount', note: 'The more you order, the cheaper per-piece. Best economy at 100+ pcs.' },
  { label: 'Rush orders', note: 'Expedited 24h turnaround available at a premium. Contact us first.' },
];

export default function Services() {
  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="page-wrapper mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag">What We Offer</span>
          <h1 className="section-title mb-4">Our Services</h1>
          <div className="divider" />
          <p className="text-gray-400 font-body max-w-2xl mt-6 text-lg leading-relaxed">
            We specialize in mini plastic injection molding for small quantities. Whether you need one prototype or a small production run, we're set up to help.
          </p>
        </motion.div>
      </section>

      {/* Services list */}
      <section className="page-wrapper space-y-6 mb-24">
        {SERVICES.map(({ id, tag, title, desc, features, cta }, i) => (
          <motion.div
            key={id}
            id={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-8 md:p-12 grid md:grid-cols-[1fr_1fr] gap-10 items-start"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-brand-500 text-sm">{tag}</span>
                <div className="h-px flex-1 bg-brand-500/20" />
              </div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-4">{title}</h2>
              <p className="text-gray-400 font-body leading-relaxed mb-6">{desc}</p>
              <Link to={cta} className="btn-primary inline-flex items-center gap-2 text-sm">
                {cta === '/quote' ? 'Request a Quote' : 'Contact Us'} <HiArrowRight />
              </Link>
            </div>
            <div>
              <p className="label mb-4">What's included</p>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <HiCheckCircle className="text-brand-500 mt-0.5 shrink-0" size={16} />
                    <span className="text-sm font-body text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Pricing notes */}
      <section className="page-wrapper mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-tag">Transparent Pricing</span>
          <h2 className="section-title mb-10">How We Price</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRICING.map(({ label, note }) => (
              <div key={label} className="card p-6 border-l-2 border-l-brand-500">
                <h3 className="font-display font-bold uppercase tracking-wide text-sm text-white mb-2">{label}</h3>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 font-body text-sm mt-6">
            We give you a detailed quote after reviewing your specific requirements. No hidden charges.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="page-wrapper">
        <div className="bg-dark-600 border border-brand-500/20 rounded-sm p-10 text-center">
          <h2 className="section-title mb-4">Ready to Start?</h2>
          <p className="text-gray-400 font-body mb-8">Submit a quote and get a response within 24 hours.</p>
          <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
            Get a Free Quote <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
