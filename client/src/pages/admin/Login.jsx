import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-brand-500 flex items-center justify-center rounded-sm mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="14" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="9" rx="1" fill="white" opacity="0.6"/>
              <rect x="9" y="12" width="6" height="3" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-white">MoldCraft</h1>
          <p className="text-gray-500 font-body text-sm mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-5">
          <div>
            <label className="label">Username or Email</label>
            <input {...register('email', { required: 'Required' })} type="text" className="input" placeholder="Username or email" autoFocus />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register('password', { required: 'Required' })} type="password" className="input" placeholder="••••••••" />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
}
