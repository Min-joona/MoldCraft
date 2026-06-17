import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { galleryApi } from '../../api';
import { HiArrowLeft, HiPlus, HiTrash, HiUpload, HiX } from 'react-icons/hi';

const MATERIALS = ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC', 'PVC', 'Other'];
const INDUSTRIES = ['hardware', 'consumer', 'industrial', 'educational', 'prototype', 'other'];

export default function GalleryManager() {
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState([]);
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['gallery-admin'],
    queryFn: () => galleryApi.getAll().then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: d => galleryApi.create(d),
    onSuccess: () => { toast.success('Item added!'); qc.invalidateQueries(['gallery-admin']); reset(); setFiles([]); setShowForm(false); },
    onError: err => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: id => galleryApi.delete(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['gallery-admin']); },
    onError: err => toast.error(err.message),
  });

  const toggleFeatured = item => {
    galleryApi.update(item._id, { featured: !item.featured })
      .then(() => { toast.success('Updated'); qc.invalidateQueries(['gallery-admin']); })
      .catch(err => toast.error(err.message));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] }, maxFiles: 10, maxSize: 5 * 1024 * 1024,
    onDrop: accepted => setFiles(f => [...f, ...accepted].slice(0, 10)),
  });

  const onSubmit = async formData => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && fd.append(k, v));
    files.forEach(f => fd.append('images', f));
    createMut.mutate(fd);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Gallery Manager</h1>
        <button onClick={() => setShowForm(s => !s)} className="ml-auto btn-primary text-xs py-2 flex items-center gap-1.5">
          <HiPlus size={14} /> Add Item
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center justify-between">
              New Gallery Item <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><HiX /></button>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Title *</label><input {...register('title', { required: true })} className="input" placeholder="Black PP Knob" /></div>
                <div><label className="label">Material</label>
                  <select {...register('material')} className="input"><option value="">Select</option>{MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                </div>
                <div><label className="label">Industry</label>
                  <select {...register('industry')} className="input capitalize">{INDUSTRIES.map(i => <option key={i} value={i} className="capitalize">{i}</option>)}</select>
                </div>
                <div><label className="label">Color</label><input {...register('color')} className="input" placeholder="e.g. Black" /></div>
              </div>
              <div><label className="label">Description</label><textarea {...register('description')} className="input resize-none h-20" placeholder="Brief description..." /></div>
              <div>
                <label className="label">Images (max 10)</label>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-white/10 hover:border-brand-500/40'}`}>
                  <input {...getInputProps()} /><HiUpload size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-body">Drop images here or click to select</p>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {files.map((f, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-sm" />
                        <button type="button" onClick={() => setFiles(ff => ff.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={createMut.isPending} className="btn-primary text-sm">{createMut.isPending ? 'Uploading...' : 'Add to Gallery'}</button>
                <button type="button" onClick={() => { reset(); setFiles([]); setShowForm(false); }} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading && <p className="text-center py-12 text-gray-500 font-body">Loading...</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data?.map(item => (
            <div key={item._id} className="card group overflow-hidden">
              <div className="relative aspect-square bg-dark-700">
                {item.images?.[0]
                  ? <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-600 font-body text-xs">No image</div>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => toggleFeatured(item)} className={`text-xs px-2 py-1 rounded-sm border font-body ${item.featured ? 'border-brand-500 text-brand-500' : 'border-white/30 text-white'}`}>
                    {item.featured ? '★ Featured' : '☆ Feature'}
                  </button>
                  <button onClick={() => { if (window.confirm('Delete?')) deleteMut.mutate(item._id); }} className="text-xs p-1 border border-red-400/50 text-red-400 rounded-sm hover:bg-red-400/10 transition-colors"><HiTrash size={12} /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-body font-medium text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.material && <span className="text-xs text-gray-500 font-body">{item.material}</span>}
                  {item.industry && <span className="text-xs text-gray-600 font-body capitalize">· {item.industry}</span>}
                </div>
              </div>
            </div>
          ))}
          {data?.data?.length === 0 && <p className="col-span-full text-center py-12 text-gray-500 font-body">No gallery items yet. Add your first one!</p>}
        </div>
      </div>
    </div>
  );
}
