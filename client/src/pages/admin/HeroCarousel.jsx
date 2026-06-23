import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { heroApi } from '../../api';
import { HiArrowLeft, HiPlus, HiTrash, HiPencil, HiX, HiPhotograph, HiEyeOff } from 'react-icons/hi';

export default function HeroCarouselAdmin() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image: '', title: '', subtitle: '', link: '', linkText: 'Learn More', isActive: true });
  const [preview, setPreview] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['hero-all'],
    queryFn: () => heroApi.getAllAdmin().then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: d => heroApi.create(d),
    onSuccess: () => { toast.success('Slide created!'); qc.invalidateQueries(['hero-all']); closeForm(); },
    onError: err => toast.error(err.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => heroApi.update(id, data),
    onSuccess: () => { toast.success('Slide updated!'); qc.invalidateQueries(['hero-all']); closeForm(); },
    onError: err => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: id => heroApi.delete(id),
    onSuccess: () => { toast.success('Slide deleted'); qc.invalidateQueries(['hero-all']); },
    onError: err => toast.error(err.message),
  });

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ image: '', title: '', subtitle: '', link: '', linkText: 'Learn More', isActive: true });
    setPreview('');
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ image: '', title: s.title, subtitle: s.subtitle, link: s.link, linkText: s.linkText || 'Learn More', isActive: s.isActive });
    setPreview(s.image);
    setShowForm(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm(f => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editing && !form.image) return toast.error('Please select an image');
    const payload = { ...form };
    if (!payload.image) delete payload.image;
    if (editing) updateMut.mutate({ id: editing._id, data: payload });
    else createMut.mutate(payload);
  };

  const moveOrder = (id, dir) => {
    if (!data) return;
    const idx = data.findIndex(s => s._id === id);
    if (idx === -1) return;
    const swap = idx + dir;
    if (swap < 0 || swap >= data.length) return;
    const cur = data[idx];
    const target = data[swap];
    Promise.all([
      heroApi.update(cur._id, { order: target.order }),
      heroApi.update(target._id, { order: cur.order }),
    ]).then(() => {
      qc.invalidateQueries(['hero-all']);
      toast.success('Reordered');
    }).catch(err => toast.error(err.message));
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Hero Carousel</h1>
        <button onClick={() => { setShowForm(true); }}
          className="ml-auto btn-primary text-xs py-2 flex items-center gap-1.5">
          <HiPlus size={14} /> Add Slide
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="font-display font-bold uppercase tracking-wide text-white mb-6 flex items-center justify-between">
              {editing ? 'Edit Slide' : 'New Slide'}
              <button onClick={closeForm} className="text-gray-500 hover:text-white"><HiX /></button>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Background Image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="input file:border-0 file:bg-transparent file:text-brand-500 file:cursor-pointer" />
                {preview && (
                  <img src={preview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-sm border border-white/5" />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title (use \n for line break)</label>
                  <textarea value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input h-20" placeholder="Turning\nPlastic\nInto Precision" />
                </div>
                <div>
                  <label className="label">Subtitle / Tag</label>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input" placeholder="Mini Injection Molding Studio" />
                </div>
                <div>
                  <label className="label">Button Link</label>
                  <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="input" placeholder="/quote" />
                </div>
                <div>
                  <label className="label">Button Text</label>
                  <input value={form.linkText} onChange={e => setForm(f => ({ ...f, linkText: e.target.value }))} className="input" placeholder="Learn More" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-brand-500" />
                  <label htmlFor="isActive" className="label mb-0">Active</label>
                </div>
              </div>
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary text-sm">
                {editing ? 'Update Slide' : 'Create Slide'}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <p className="text-center py-12 text-gray-500 font-body">Loading...</p>
        ) : (
          <div className="space-y-3">
            {data?.length === 0 && (
              <div className="card p-12 text-center">
                <HiPhotograph size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 font-body text-sm">No slides yet. Add your first hero slide.</p>
              </div>
            )}
            {data?.map((s, i) => (
              <div key={s._id} className="card p-4 flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveOrder(s._id, -1)} disabled={i === 0}
                    className="text-gray-600 hover:text-white disabled:opacity-30 text-xs leading-none">&uarr;</button>
                  <button onClick={() => moveOrder(s._id, 1)} disabled={i === data.length - 1}
                    className="text-gray-600 hover:text-white disabled:opacity-30 text-xs leading-none">&darr;</button>
                </div>
                <img src={s.image} alt="" className="w-24 h-16 object-cover rounded-sm border border-white/5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-medium text-white text-sm truncate">{s.title?.split('\n')[0] || 'Untitled'}</span>
                    {!s.isActive && <HiEyeOff size={14} className="text-gray-600" />}
                  </div>
                  <p className="text-xs text-gray-500 font-body truncate">{s.subtitle || 'No subtitle'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-2 text-gray-500 hover:text-white transition-colors"><HiPencil size={16} /></button>
                  <button onClick={() => { if (window.confirm('Delete this slide?')) deleteMut.mutate(s._id); }}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"><HiTrash size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
