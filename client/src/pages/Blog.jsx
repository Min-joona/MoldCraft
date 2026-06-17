import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiClock, HiEye, HiArrowRight } from 'react-icons/hi';
import { blogApi } from '../api';

const CATEGORIES = ['how-to', 'materials', 'tips', 'news', 'case-study'];

export default function Blog() {
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blog', category],
    queryFn: () => blogApi.getAll({ category: category || undefined, limit: 12 }).then((r) => r.data),
  });

  const posts = data?.data ?? [];

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="page-wrapper mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag">Knowledge Base</span>
          <h1 className="section-title mb-4">Blog & Resources</h1>
          <div className="divider" />
          <p className="text-gray-400 font-body mt-6 max-w-xl">Tips, guides, and insights on injection molding, materials, and product design.</p>
        </motion.div>
      </section>

      {/* Category filters */}
      <section className="page-wrapper mb-10">
        <div className="flex flex-wrap gap-2">
          {['', ...CATEGORIES].map((c) => (
            <button key={c || 'all'} onClick={() => setCategory(c)}
              className={`px-4 py-2 text-xs rounded-sm border font-body uppercase tracking-wider transition-colors capitalize ${category === c ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
              {c || 'All'}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="page-wrapper">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-dark-600 rounded-sm animate-pulse" />)}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-24 text-gray-500 font-body text-sm">
            No posts yet. Check back soon!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${post.slug}`} className="card-hover block h-full">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-brand-500 font-body uppercase tracking-wider capitalize">{post.category}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-600 font-body">{new Date(post.publishedAt || post.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="font-display font-bold uppercase tracking-wide text-white text-lg leading-tight mb-3">{post.title}</h2>
                  <p className="text-sm text-gray-400 font-body leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-600 font-body">
                      {post.readTime && <span className="flex items-center gap-1"><HiClock size={12} />{post.readTime} min</span>}
                      {post.views > 0 && <span className="flex items-center gap-1"><HiEye size={12} />{post.views}</span>}
                    </div>
                    <span className="text-brand-500 text-xs font-body flex items-center gap-1">Read <HiArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
