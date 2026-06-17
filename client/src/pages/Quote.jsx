import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { HiUpload, HiCheckCircle, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { quotesApi } from '../api';

const MATERIALS = ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC', 'PVC', 'Other'];
const STEPS = ['Your Info', 'Part Details', 'Upload & Submit'];

export default function Quote() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors }, getValues } = useForm();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    onDrop: (accepted) => setFiles((f) => [...f, ...accepted].slice(0, 5)),
  });

  const nextStep = async () => {
    const fields = step === 0 ? ['name', 'email', 'phone'] : ['partDescription', 'material', 'quantity'];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      files.forEach((f) => formData.append('referenceImages', f));
      const res = await quotesApi.submit(formData);
      setQuoteNumber(res.data.quoteNumber);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
        <HiCheckCircle size={64} className="text-brand-500 mx-auto mb-6" />
        <h1 className="font-display text-5xl font-extrabold uppercase text-white mb-4">Quote Submitted!</h1>
        <p className="text-gray-400 font-body mb-3">Your quote number is:</p>
        <div className="inline-block bg-brand-500 text-white font-mono text-2xl font-bold px-6 py-3 rounded-sm mb-6">{quoteNumber}</div>
        <p className="text-gray-400 font-body text-sm mb-8">We've sent a confirmation to your email. Our team will review and respond within 1–2 business days.</p>
        <a href="/" className="btn-primary inline-flex items-center gap-2">Back to Home <HiArrowRight /></a>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="section-tag">Free, No-Obligation</span>
          <h1 className="section-title">Get a Quote</h1>
          <div className="divider mt-4" />
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-500' : 'text-gray-600'}`}>
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-mono font-bold border
                  ${i < step ? 'bg-brand-500 border-brand-500 text-white' : i === step ? 'border-brand-500 text-brand-500' : 'border-white/10 text-gray-600'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs font-body uppercase tracking-wider hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-brand-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 0 */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="label">Full Name *</label>
                  <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Juan dela Cruz" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input" placeholder="juan@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input {...register('phone')} className="input" placeholder="+251 9x xxx xxxx" />
                </div>
                <div>
                  <label className="label">Company / Organization</label>
                  <input {...register('company')} className="input" placeholder="Optional" />
                </div>
              </motion.div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="label">Describe Your Part *</label>
                  <textarea {...register('partDescription', { required: 'Description is required', minLength: { value: 10, message: 'Please describe more' } })} className="input resize-none h-28" placeholder="e.g. A 40mm circular cap with a 5mm hole in the center, wall thickness 2mm..." />
                  {errors.partDescription && <p className="text-red-400 text-xs mt-1">{errors.partDescription.message}</p>}
                </div>
                <div>
                  <label className="label">Material *</label>
                  <select {...register('material', { required: 'Material is required' })} className="input">
                    <option value="">Select a material</option>
                    {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.material && <p className="text-red-400 text-xs mt-1">{errors.material.message}</p>}
                  <p className="text-xs text-gray-600 mt-1 font-body">Not sure? <a href="/materials" className="text-brand-500 hover:underline" target="_blank" rel="noreferrer">Check our materials guide →</a></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Quantity *</label>
                    <input type="number" {...register('quantity', { required: 'Required', min: { value: 1, message: 'Min 1' } })} className="input" placeholder="e.g. 50" />
                    {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
                  </div>
                  <div>
                    <label className="label">Preferred Color</label>
                    <input {...register('color')} className="input" placeholder="e.g. Black, Red" />
                  </div>
                </div>
                <div>
                  <label className="label">Do you have an existing mold?</label>
                  <div className="flex gap-4 mt-2">
                    {['Yes', 'No'].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" {...register('hasMold')} value={v === 'Yes' ? 'true' : 'false'} className="accent-brand-500" />
                        <span className="text-sm font-body text-gray-300">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="label">Reference Images (optional, max 5)</label>
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-white/10 hover:border-brand-500/50'}`}>
                    <input {...getInputProps()} />
                    <HiUpload size={28} className="text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-body">{isDragActive ? 'Drop images here...' : 'Drag & drop images, or click to select'}</p>
                    <p className="text-xs text-gray-600 mt-1">JPEG, PNG, WebP — max 5MB each</p>
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {files.map((f, i) => (
                        <div key={i} className="relative">
                          <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-sm border border-white/10" />
                          <button type="button" onClick={() => setFiles((ff) => ff.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="label">Additional Notes</label>
                  <textarea {...register('additionalNotes')} className="input resize-none h-28" placeholder="Tolerances, special requirements, deadline, etc." />
                </div>

                {/* Summary */}
                <div className="bg-dark-700 border border-white/5 rounded-sm p-6">
                  <h3 className="font-display font-bold uppercase tracking-wide text-sm text-white mb-4">Quote Summary</h3>
                  {[
                    ['Name', getValues('name')],
                    ['Email', getValues('email')],
                    ['Part', getValues('partDescription')],
                    ['Material', getValues('material')],
                    ['Quantity', getValues('quantity')],
                  ].map(([k, v]) => v && (
                    <div key={k} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-body">{k}</span>
                      <span className="text-xs text-gray-300 font-body max-w-[200px] text-right truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost flex items-center gap-2">
                <HiArrowLeft /> Back
              </button>
            ) : <div />}

            {step < 2 ? (
              <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                Continue <HiArrowRight />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Submit Quote <HiArrowRight /></>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
