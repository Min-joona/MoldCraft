import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiZoomIn } from 'react-icons/hi';
import { galleryApi } from '../api';

const MATERIALS = ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC', 'PVC', 'Other'];
const INDUSTRIES = ['hardware', 'consumer', 'industrial', 'educational', 'prototype', 'other'];

export default function Gallery() {
  const [material, setMaterial] = useState('');
  const [industry, setIndustry] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', material, industry],
    queryFn: () => galleryApi.getAll({ material: material || undefined, industry: industry || undefined }).then((r) => r.data),
  });

  const items = data?.data ?? [];

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="page-wrapper mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag">Our Work</span>
          <h1 className="section-title mb-4">Gallery</h1>
          <div className="divider" />
          <p className="text-gray-400 font-body mt-6 max-w-xl">Browse parts we've produced. Filter by material or industry to find examples relevant to your project.</p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="page-wrapper mb-10">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="label mb-2">Material</p>
            <div className="flex flex-wrap gap-2">
              {['', ...MATERIALS].map((m) => (
                <button key={m || 'all'} onClick={() => setMaterial(m)}
                  className={`px-3 py-1.5 text-xs rounded-sm border font-body transition-colors ${material === m ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                  {m || 'All'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label mb-2">Industry</p>
            <div className="flex flex-wrap gap-2">
              {['', ...INDUSTRIES].map((ind) => (
                <button key={ind || 'all'} onClick={() => setIndustry(ind)}
                  className={`px-3 py-1.5 text-xs rounded-sm border font-body transition-colors capitalize ${industry === ind ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                  {ind || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="page-wrapper">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-dark-600 rounded-sm animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 font-body text-sm mb-4">No items match your filters.</p>
            <button onClick={() => { setMaterial(''); setIndustry(''); }} className="btn-secondary text-sm">Clear filters</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="group card-hover cursor-pointer overflow-hidden"
              onClick={() => setLightbox(item)}
            >
              <div className="aspect-square bg-dark-700 relative overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-body">No image</div>
                )}
                <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <HiZoomIn size={28} className="text-white" />
                </div>
                {item.featured && (
                  <span className="absolute top-2 left-2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-sm font-body font-medium">Featured</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-body font-medium text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.material && <span className="text-xs font-mono text-brand-500">{item.material}</span>}
                  {item.color && <span className="text-xs text-gray-600 font-body">· {item.color}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-900/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-dark-700 border border-white/10 rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="font-display font-bold uppercase tracking-wide text-white">{lightbox.title}</h3>
                <button onClick={() => setLightbox(null)} className="text-gray-400 hover:text-white"><HiX size={20} /></button>
              </div>
              <div className="p-6">
                {lightbox.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {lightbox.images.map((img, i) => (
                      <img key={i} src={img.url} alt="" className={`rounded-sm object-cover ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`} />
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {lightbox.material && <div><p className="label mb-1">Material</p><span className="font-mono text-sm text-brand-500">{lightbox.material}</span></div>}
                  {lightbox.color && <div><p className="label mb-1">Color</p><span className="text-sm text-gray-300 font-body">{lightbox.color}</span></div>}
                  {lightbox.industry && <div><p className="label mb-1">Industry</p><span className="text-sm text-gray-300 font-body capitalize">{lightbox.industry}</span></div>}
                </div>
                {lightbox.description && <p className="text-sm text-gray-400 font-body leading-relaxed mb-6">{lightbox.description}</p>}
                <a href="/quote" className="btn-primary text-sm inline-flex items-center gap-2">Order Similar Part</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
