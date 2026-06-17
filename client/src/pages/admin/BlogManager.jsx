import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { blogApi } from '../../api';
import { HiArrowLeft, HiPlus, HiTrash, HiPencil, HiX, HiEye } from 'react-icons/hi';

const CATEGORIES = ['how-to', 'materials', 'tips', 'news', 'case-study'];

export default function BlogManager() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['blog-admin'],
    queryFn: () => blogApi.getAll({ limit: 50 }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: d => blogApi.create(d),
    onSuccess: () => { toast.success('Post created!'); qc.invalidateQueries(['blog-admin']); reset(); setShowForm(false); },
    onError: err => toast.error(err.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => blogApi.update(id, data),
    onSuccess: () => { toast.success('Post updated!'); qc.invalidateQueries(['blog-admin']); setEditing(null); setShowForm(false); reset(); },
    onError: err => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: id => blogApi.delete(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['blog-admin']); },
    onError: err => toast.error(err.message),
  });

  const openEdit = post => {
    setEditing(post);
    setValue('title', post.title);
    setValue('excerpt', post.excerpt);
    setValue('content', post.content);
    setValue('category', post.category);
    setValue('tags', post.tags?.join(', '));
    setValue('isPublished', post.isPublished);
    setShowForm(true);
  };

  const onSubmit = data => {
    const payload = { ...data, tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    if (editing) updateMut.mutate({ id: editing._id, data: payload });
    else createMut.mutate(payload);
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Blog Manager</h1>
        <button onClick={() => { setEditing(null); reset(); setShowForm(s => !s); }}
          className="ml-auto btn-primary text-xs py-2 flex items-center gap-1.5">
          <HiPlus size={14} /> New Post
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center justify-between">
              {editing ? 'Edit Post' : 'New Post'}
              <button onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="text-gray-500 hover:text-white"><HiX /></button>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label">Title *</label>
                <input {...register('title', { required: true })} className="input" placeholder="How to choose the right plastic material" />
              </div>
              <div>
                <label className="label">Excerpt *</label>
                <textarea {...register('excerpt', { required: true })} className="input resize-none h-20"
                  placeholder="Short summary shown on the blog listing page..." />
              </div>
              <div>
                <label className="label">Content * (Markdown supported)</label>
                <textarea {...register('content', { required: true })} className="input resize-none h-64 font-mono text-xs"
                  placeholder="## Introduction&#10;&#10;Write your full blog post here in Markdown..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select {...register('category')} className="input capitalize">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.replace('-', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input {...register('tags')} className="input" placeholder="PP, materials, beginner" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" {...register('isPublished')} id="published" className="accent-brand-500 w-4 h-4" />
                <label htmlFor="published" className="text-sm font-body text-gray-300 cursor-pointer">Publish immediately</label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={isPending} className="btn-primary text-sm">
                  {isPending ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        {isLoading && <p className="text-center py-12 text-gray-500 font-body">Loading...</p>}
        <div className="space-y-3">
          {data?.data?.map(post => (
            <div key={post._id} className="card p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-body capitalize ${post.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-600 font-body capitalize">{post.category?.replace('-', ' ')}</span>
                  {post.readTime && <span className="text-xs text-gray-600 font-body">{post.readTime} min read</span>}
                </div>
                <h3 className="font-body font-medium text-white truncate">{post.title}</h3>
                <p className="text-xs text-gray-500 font-body mt-1 line-clamp-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-2">
                  {post.tags?.map(t => (
                    <span key={t} className="text-xs text-gray-600 font-body">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {post.isPublished && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                    className="p-2 text-gray-500 hover:text-white transition-colors"><HiEye size={16} /></a>
                )}
                <button onClick={() => openEdit(post)} className="p-2 text-gray-500 hover:text-white transition-colors"><HiPencil size={16} /></button>
                <button onClick={() => { if (window.confirm('Delete this post?')) deleteMut.mutate(post._id); }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"><HiTrash size={16} /></button>
              </div>
            </div>
          ))}
          {data?.data?.length === 0 && (
            <div className="text-center py-16 text-gray-500 font-body">
              <p className="text-4xl mb-3">✍️</p>
              <p>No posts yet. Write your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
