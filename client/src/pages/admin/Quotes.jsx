import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { quotesApi } from '../../api';
import { HiArrowLeft, HiTrash, HiRefresh } from 'react-icons/hi';

const STATUS_OPTIONS = ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'];
const STATUS_COLORS = {
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  reviewing: 'text-blue-400   bg-blue-400/10   border-blue-400/20',
  quoted:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  accepted:  'text-green-400  bg-green-400/10  border-green-400/20',
  rejected:  'text-red-400    bg-red-400/10    border-red-400/20',
  completed: 'text-gray-400   bg-gray-400/10   border-gray-400/20',
};

export default function AdminQuotes() {
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['quotes', filterStatus],
    queryFn: () => quotesApi.getAll({ status: filterStatus || undefined, limit: 50 }).then(r => r.data),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => quotesApi.update(id, payload),
    onSuccess: () => { toast.success('Quote updated'); qc.invalidateQueries(['quotes']); },
    onError: err => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: id => quotesApi.delete(id),
    onSuccess: () => { toast.success('Deleted'); setSelected(null); qc.invalidateQueries(['quotes']); },
    onError: err => toast.error(err.message),
  });

  const selectQuote = q => { setSelected(q); setAdminNotes(q.adminNotes || ''); setQuotedPrice(q.quotedPrice || ''); };
  const handleStatus = (id, status) => updateMut.mutate({ id, payload: { status } });
  const handleSave   = () => updateMut.mutate({ id: selected._id, payload: { adminNotes, ...(quotedPrice && { quotedPrice: Number(quotedPrice) }) } });

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors"><HiArrowLeft size={20} /></Link>
        <h1 className="font-display font-bold uppercase tracking-widest text-white">Quote Requests</h1>
        <button onClick={() => refetch()} className="ml-auto text-gray-500 hover:text-white transition-colors"><HiRefresh size={18} /></button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-6 flex-wrap">
            {['', ...STATUS_OPTIONS].map(s => (
              <button key={s || 'all'} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs font-body uppercase tracking-wider rounded-sm border transition-colors capitalize
                  ${filterStatus === s ? 'border-brand-500 text-brand-500 bg-brand-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          {isLoading && <p className="text-center py-12 text-gray-500 font-body">Loading...</p>}

          <div className="space-y-2">
            {data?.data?.map(q => (
              <div key={q._id} onClick={() => selectQuote(q)}
                className={`card p-4 cursor-pointer transition-all ${selected?._id === q._id ? 'border-brand-500/50 bg-dark-500' : 'hover:border-white/10'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-brand-500">{q.quoteNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-sm border capitalize font-body ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                    </div>
                    <p className="font-body font-medium text-white text-sm">{q.name}</p>
                    <p className="text-xs text-gray-500 font-body mt-0.5 truncate">{q.partDescription}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400 font-body">{q.material}</p>
                    <p className="text-xs text-gray-500 font-body">{q.quantity} pcs</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{new Date(q.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {data?.data?.length === 0 && <p className="text-center py-12 text-gray-500 font-body">No quotes found.</p>}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <div className="card sticky top-6">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-sm text-brand-500">{selected.quoteNumber}</span>
                <button onClick={() => { if (window.confirm('Delete this quote?')) deleteMut.mutate(selected._id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors"><HiTrash size={16} /></button>
              </div>
              <div className="p-5 space-y-4 text-sm overflow-y-auto max-h-[80vh]">
                {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone || '—'],
                  ['Company', selected.company || '—'], ['Material', selected.material],
                  ['Quantity', `${selected.quantity} pcs`], ['Color', selected.color || '—'],
                  ['Has Mold', selected.hasMold ? 'Yes' : 'No']].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-body block mb-0.5">{k}</span>
                    <span className="text-gray-200 font-body break-words">{v}</span>
                  </div>
                ))}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-body block mb-0.5">Description</span>
                  <p className="text-gray-200 font-body text-xs leading-relaxed">{selected.partDescription}</p>
                </div>

                {selected.referenceImages?.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-body block mb-2">Images</span>
                    <div className="flex flex-wrap gap-2">
                      {selected.referenceImages.map((img, i) => (
                        <a key={i} href={img.url} target="_blank" rel="noreferrer">
                          <img src={img.url} alt="" className="w-14 h-14 object-cover rounded-sm border border-white/10 hover:border-brand-500 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Status</label>
                  <select value={selected.status}
                    onChange={e => { handleStatus(selected._id, e.target.value); setSelected(q => ({ ...q, status: e.target.value })); }}
                    className="input text-xs py-2">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Quoted Price (₱)</label>
                  <input type="number" value={quotedPrice} onChange={e => setQuotedPrice(e.target.value)} className="input text-xs py-2" placeholder="e.g. 1500" />
                </div>
                <div>
                  <label className="label">Admin Notes</label>
                  <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="input text-xs py-2 resize-none h-20" placeholder="Internal notes..." />
                </div>
                <button onClick={handleSave} disabled={updateMut.isPending} className="btn-primary w-full text-xs py-2.5">
                  {updateMut.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
