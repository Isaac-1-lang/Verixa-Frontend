"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Shield, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      if (error.data?.message) {
        newErrors._root = error.data.message;
      } else if (error.status === 401) {
        newErrors._root = "Invalid email or password";
      } else if (error.status === 403) {
        newErrors._root = "Access denied. Please contact administrator.";
      } else {
        newErrors._root = "Login failed. Please try again.";
      }
      setErrors(newErrors);
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors._root) setErrors(prev => ({ ...prev, _root: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-offwhite relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-5 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-navy opacity-[0.03] rounded-md blur-[150px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy opacity-[0.02] rounded-md blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1100px] bg-white rounded-md border border-navy/5 shadow-2xl shadow-navy/5 overflow-hidden flex flex-col lg:flex-row relative z-10"
      >

        {/* LEFT — Form */}
        <div className="w-full lg:w-1/2 p-12 sm:p-20 lg:p-24 bg-white/2">
          <Link href="/" className="text-4xl font-bold text-navy mb-16 block ">
            Verixa
          </Link>

          <h2 className="text-5xl font-bold text-navy mb-4  leading-tight">Welcome Back</h2>
          <p className="text-navy/40 text-sm font-medium mb-12">
            No account? <Link href="/auth/signup" className="text-navy font-bold hover:underline">Create a new workspace</Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-8">
            {errors._root && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 bg-red-50 border border-red-100 text-red-600 rounded-md text-xs font-bold"
              >
                Error: {errors._root}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy/40 ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, 'email')}
                  className={`w-full rounded-md pl-16 pr-8 py-5 text-sm font-bold border transition-all ${errors.email
                    ? 'border-red-200 bg-red-50/30 text-navy'
                    : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                    } outline-none placeholder:text-navy/20`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500 font-bold ml-4">{errors.email}</span>}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-bold text-navy/40">Password</label>
                <Link href="/forgot-password" title="Reset password" className="text-[10px] font-bold text-navy/40 hover:text-navy transition-all">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange(e, 'password')}
                  className={`w-full rounded-md pl-16 pr-16 py-5 text-sm font-bold border transition-all ${errors.password
                    ? 'border-red-200 bg-red-50/30 text-navy'
                    : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                    } outline-none placeholder:text-navy/20`}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/20 hover:text-navy transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500 font-bold ml-4">{errors.password}</span>}
            </div>

            <div className="flex items-center gap-3 px-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-navy cursor-pointer rounded-md border-navy/10 bg-transparent"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-xs text-navy/40 font-bold cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-6 rounded-md font-bold text-sm flex items-center justify-center gap-4 mt-8 bg-navy text-white transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
            </motion.button>
          </form>
        </div>

        {/* RIGHT — Brand Panel */}
        <div className="hidden lg:flex w-1/2 bg-offwhite relative items-center justify-center p-20 border-l border-navy/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-navy/5 rotate-12 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 bg-white rounded-md border border-navy/10 flex items-center justify-center shadow-2xl mb-12 mx-auto"
            >
              <Shield className="text-navy" size={60} strokeWidth={1} />
            </motion.div>
            <h3 className="text-4xl font-bold text-navy mb-8 leading-tight ">
              Quality Unified.<br />Engineered QA.
            </h3>
            <p className="text-sm text-navy/40 font-medium max-w-xs mx-auto leading-relaxed">
              Absolute governance over UAT telemetry. Deploy with structural integrity and confidence.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}