import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiClock, HiEye, HiCalendar } from 'react-icons/hi';
import { blogApi } from '../api';

export default function BlogPost() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.getOne(slug).then((r) => r.data),
  });

  const post = data?.data;

  if (isLoading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError || !post) return (
    <div className="min-h-screen pt-28 flex items-center justify-center flex-col gap-4">
      <span className="font-display text-6xl font-bold text-brand-500">404</span>
      <p className="text-gray-400 font-body">Post not found</p>
      <Link to="/blog" className="btn-primary text-sm">Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-body text-sm mb-10">
          <HiArrowLeft /> Back to Blog
        </Link>

        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-brand-500 font-body uppercase tracking-wider capitalize">{post.category}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide text-white leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center gap-5 text-sm text-gray-500 font-body mb-8 flex-wrap">
            {post.publishedAt && <span className="flex items-center gap-1.5"><HiCalendar size={14} />{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
            {post.readTime && <span className="flex items-center gap-1.5"><HiClock size={14} />{post.readTime} min read</span>}
            {post.views > 0 && <span className="flex items-center gap-1.5"><HiEye size={14} />{post.views} views</span>}
            {post.author && <span>By {post.author.name}</span>}
          </div>
          <div className="divider mb-8" />
        </motion.div>

        {/* Cover image */}
        {post.coverImage && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={post.coverImage.url}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-sm mb-12 border border-white/5"
          />
        )}

        {/* Content — rendered as pre-formatted text (add a Markdown renderer later) */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-sm max-w-none font-body"
          style={{
            color: '#9CA3AF',
            lineHeight: '1.9',
            fontSize: '15px',
          }}
        >
          {/* Simple newline-to-paragraph rendering. Replace with react-markdown for full Markdown support */}
          {post.content.split('\n\n').map((para, i) => {
            if (para.startsWith('# ')) return <h1 key={i} style={{ color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '2rem 0 1rem' }}>{para.slice(2)}</h1>;
            if (para.startsWith('## ')) return <h2 key={i} style={{ color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', margin: '2rem 0 0.75rem' }}>{para.slice(3)}</h2>;
            if (para.startsWith('### ')) return <h3 key={i} style={{ color: '#e5e7eb', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' }}>{para.slice(4)}</h3>;
            return <p key={i} style={{ marginBottom: '1.25rem' }}>{para}</p>;
          })}
        </motion.article>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/5">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs border border-white/10 text-gray-400 rounded-sm font-body hover:border-brand-500/40 cursor-default">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-dark-600 border border-brand-500/20 rounded-sm p-8 text-center">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white mb-2">Need Custom Parts?</h3>
          <p className="text-gray-400 font-body text-sm mb-5">Get a free quote from us — fast turnaround, low minimums.</p>
          <Link to="/quote" className="btn-primary text-sm inline-flex items-center gap-2">Get a Quote →</Link>
        </div>
      </div>
    </div>
  );
}
