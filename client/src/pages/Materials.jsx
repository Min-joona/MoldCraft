import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { materialsApi } from '../api';

const COST_DOTS = (n) => Array.from({ length: 4 }).map((_, i) => (
  <span key={i} className={`inline-block w-2 h-2 rounded-full mr-1 ${i < Math.round(n) ? 'bg-brand-500' : 'bg-white/10'}`} />
));

export default function Materials() {
  const { data, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsApi.getAll().then((r) => r.data),
  });

  const materials = data?.data ?? [];

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="page-wrapper mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag">Choose Wisely</span>
          <h1 className="section-title mb-4">Materials Guide</h1>
          <div className="divider" />
          <p className="text-gray-400 font-body mt-6 max-w-2xl leading-relaxed">
            Not sure which plastic to use? Here's a breakdown of the materials we work with — their properties, typical uses, and tradeoffs. Still unsure? Just ask us in your quote.
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="page-wrapper mb-16">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-dark-600 rounded-sm animate-pulse" />)}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover p-8"
            >
              {/* Color dot + name */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: m.color + '22', border: `1.5px solid ${m.color}55` }}>
                  <span className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.id}</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-lg leading-tight">{m.name}</h2>
                </div>
              </div>

              {/* Properties */}
              <div className="space-y-3 mb-6">
                {[
                  ['Flexibility', m.flexibilty],
                  ['Heat Resistance', m.heatResistance],
                  ['Chemical Resistance', m.chemicalResistance],
                  ['Color Options', m.colorOptions],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-body">{label}</span>
                    <span className="text-gray-300 font-body text-right ml-4">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-body">Relative Cost</span>
                  <span>{COST_DOTS(m.costIndex * 1.2)}</span>
                </div>
              </div>

              {/* Uses */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-body mb-1.5">Typical Uses</p>
                <p className="text-sm text-gray-400 font-body">{m.typicalUses}</p>
              </div>

              {/* Pros/Cons */}
              <div className="grid grid-cols-2 gap-3 text-xs font-body">
                <div className="bg-green-500/5 border border-green-500/10 rounded-sm p-3">
                  <p className="text-green-400 font-semibold mb-1">Pros</p>
                  <p className="text-gray-400 leading-relaxed">{m.pros}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3">
                  <p className="text-red-400 font-semibold mb-1">Cons</p>
                  <p className="text-gray-400 leading-relaxed">{m.cons}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="page-wrapper mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white mb-6">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-semibold">Material</th>
                  <th className="text-left py-3 px-4 text-gray-500 uppercase tracking-widest text-xs font-semibold">Flex</th>
                  <th className="text-left py-3 px-4 text-gray-500 uppercase tracking-widest text-xs font-semibold">Heat</th>
                  <th className="text-left py-3 px-4 text-gray-500 uppercase tracking-widest text-xs font-semibold">Food-safe</th>
                  <th className="text-left py-3 px-4 text-gray-500 uppercase tracking-widest text-xs font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'PP', flex: 'Semi', heat: '100°C', food: '✓', cost: '$' },
                  { id: 'ABS', flex: 'Rigid', heat: '80°C', food: '✗', cost: '$' },
                  { id: 'HDPE', flex: 'Flexible', heat: '80°C', food: '✓', cost: '$' },
                  { id: 'Nylon', flex: 'Semi', heat: '130°C', food: '✗', cost: '$$' },
                  { id: 'TPU', flex: 'Very', heat: '90°C', food: '✗', cost: '$$$' },
                  { id: 'PC', flex: 'Rigid', heat: '135°C', food: '✗', cost: '$$$' },
                ].map((row, i) => (
                  <tr key={row.id} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                    <td className="py-3 pr-4 font-mono text-brand-500 font-bold">{row.id}</td>
                    <td className="py-3 px-4 text-gray-300">{row.flex}</td>
                    <td className="py-3 px-4 text-gray-300">{row.heat}</td>
                    <td className={`py-3 px-4 font-bold ${row.food === '✓' ? 'text-green-400' : 'text-gray-600'}`}>{row.food}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="page-wrapper">
        <div className="bg-dark-600 border border-brand-500/20 rounded-sm p-10 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-3">Still Unsure?</h2>
          <p className="text-gray-400 font-body mb-6">Tell us what your part needs to do and we'll recommend the right material.</p>
          <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
            Get a Free Quote <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
