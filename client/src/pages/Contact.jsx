import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { useState } from 'react';
import { contactApi } from '../api';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactApi.send(data);
      setSent(true);
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="page-wrapper mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag">Reach Out</span>
          <h1 className="section-title mb-4">Contact Us</h1>
          <div className="divider" />
        </motion.div>
      </section>

      <section className="page-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {sent ? (
              <div className="card p-12 text-center">
                <HiCheckCircle size={48} className="text-brand-500 mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-3">Message Sent!</h2>
                <p className="text-gray-400 font-body mb-6">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSent(false)} className="btn-secondary text-sm">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Your Name *</label>
                    <input {...register('name', { required: 'Required' })} className="input" placeholder="Juan dela Cruz" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} className="input" placeholder="juan@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Phone</label>
                    <input {...register('phone')} className="input" placeholder="+251 93 368 0059" />
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input {...register('subject')} className="input" placeholder="General inquiry, pricing, etc." />
                  </div>
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea
                    {...register('message', { required: 'Required', minLength: { value: 10, message: 'Too short' } })}
                    className="input resize-none h-36"
                    placeholder="Tell us about your project or ask anything…"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-fit">
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Message'}
                </button>
                <p className="text-xs text-gray-600 font-body">
                  For project quotes, please use the{' '}
                  <a href="/quote" className="text-brand-500 hover:underline">dedicated quote form</a>{' '}
                  for faster processing.
                </p>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card p-8 space-y-6">
              <h2 className="font-display font-bold uppercase tracking-wide text-white">Get In Touch</h2>
              <div className="space-y-4">
                <a href="mailto:kimsabu36@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                    <HiMail className="text-brand-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-body mb-0.5">Email</p>
                    <p className="text-sm text-white font-body group-hover:text-brand-400 transition-colors">kimsabu36@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+251 93 368 0059" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                    <HiPhone className="text-brand-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-body mb-0.5">Phone / WhatsApp</p>
                    <p className="text-sm text-white font-body group-hover:text-brand-400 transition-colors">+251 93 368 0059</p>
                  </div>
                </a>
                <a href="https://maps.app.goo.gl/a8B6TCtZV6Lg7UgT8" target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-sm flex items-center justify-center shrink-0">
                    <HiLocationMarker className="text-brand-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-body mb-0.5">Location</p>
                    <p className="text-sm text-white font-body group-hover:text-brand-400 transition-colors">Addis Ababa, Ethiopia</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Business hours */}
            <div className="card p-8">
              <h3 className="label mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm font-body">
                {[['Monday – Friday', '9:00 AM – 6:00 PM'], ['Saturday', '9:00 AM – 3:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                  <div key={day} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-gray-500">{day}</span>
                    <span className="text-gray-300">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="card p-8">
              <h3 className="label mb-4">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590619546219' },
                  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/moldcraft32' },
                  { icon: FaTiktok, label: 'TikTok', href: 'https://tiktok.com/@moldcraft32' },
                  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/251933680059' },
                  { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://linkedin.com/company/moldcraft32' },
                  { icon: FaXTwitter, label: 'X (Twitter)', href: 'https://x.com/moldcraft32' },
                  { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com/@moldcraft32' },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" title={label} className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
