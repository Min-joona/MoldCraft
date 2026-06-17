import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contentApi } from '../../api';
import { HiArrowLeft, HiSave, HiRefresh } from 'react-icons/hi';

export default function ContentManager() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [formData, setFormData] = useState({ title: '', sections: '', meta: '' });
  const qc = useQueryClient();

  const { data: pagesData, isLoading } = useQuery({
    queryKey: ['content-pages'],
    queryFn: () => contentApi.getAll().then(r => r.data),
  });

  const { data: pageDetail, refetch: refetchDetail } = useQuery({
    queryKey: ['content-page', selectedKey],
    queryFn: () => contentApi.getOne(selectedKey).then(r => r.data),
    enabled: !!selectedKey,
  });

  const updateMut = useMutation({
    mutationFn: ({ key, data }) => contentApi.update(key, data),
    onSuccess: () => { toast.success('Content updated!'); qc.invalidateQueries(['content-pages']); },
    onError: err => toast.error(err.message),
  });

  const selectPage = (key) => {
    setSelectedKey(key);
    if (pageDetail) {
      setFormData({
        title: pageDetail.title || '',
        sections: JSON.stringify(pageDetail.sections || [], null, 2),
        meta: JSON.stringify(pageDetail.meta || {}, null, 2),
      });
    }
  };

  const handleSave = () => {
    if (!selectedKey) return;
    try {
      const payload = { title: formData.title };
      if (formData.sections) payload.sections = JSON.parse(formData.sections);
      if (formData.meta) payload.meta = JSON.parse(formData.meta);
      updateMut.mutate({ key: selectedKey, data: payload });
    } catch (e) {
      toast.error('Invalid JSON in sections or meta field');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Content Manager</h1>
        <button onClick={() => refetchDetail()} className="ml-auto text-gray-500 hover:text-white transition-colors"><HiRefresh size={18} /></button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <p className="text-center py-12 text-gray-500 font-body">Loading...</p>
        ) : pagesData?.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400 font-body mb-4">No content pages yet. They appear here after you update them.</p>
            <p className="text-sm text-gray-600 font-body">Use the API to seed initial content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-body mb-3">Pages</p>
              {pagesData?.map(p => (
                <button key={p.key} onClick={() => selectPage(p.key)}
                  className={`w-full text-left p-3 rounded-sm text-sm font-body transition-all
                    ${selectedKey === p.key ? 'bg-brand-500/10 border border-brand-500/30 text-brand-400' : 'bg-dark-800 border border-white/5 text-gray-300 hover:border-white/20'}`}>
                  <div className="font-medium">{p.key}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {p.isActive ? 'Active' : 'Inactive'} · {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Never'}
                  </div>
                </button>
              ))}
            </div>

            <div>
              {selectedKey ? (
                <div className="card p-6 space-y-5">
                  <h2 className="font-display font-bold uppercase tracking-wide text-white">Editing: {selectedKey}</h2>

                  <div>
                    <label className="label">Title</label>
                    <input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                      className="input" placeholder="Page title" />
                  </div>

                  <div>
                    <label className="label">Sections (JSON array)</label>
                    <textarea value={formData.sections} onChange={e => setFormData(f => ({ ...f, sections: e.target.value }))}
                      className="input font-mono text-xs resize-none h-48" placeholder='[{ "type": "text", "title": "...", "content": "..." }]' />
                    <p className="text-xs text-gray-600 mt-1 font-body">
                      Each section: {'{'} "type": "hero|text|grid|cards|cta|gallery|stats", "title": "", "content": "", "items": [] {'}'}
                    </p>
                  </div>

                  <div>
                    <label className="label">Meta (JSON)</label>
                    <textarea value={formData.meta} onChange={e => setFormData(f => ({ ...f, meta: e.target.value }))}
                      className="input font-mono text-xs resize-none h-24" placeholder='{ "description": "...", "keywords": [] }' />
                  </div>

                  <button onClick={handleSave} disabled={updateMut.isPending}
                    className="btn-primary flex items-center gap-2 text-sm">
                    <HiSave size={16} /> {updateMut.isPending ? 'Saving...' : 'Save Content'}
                  </button>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-gray-500 font-body">Select a page from the list to edit its content.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
