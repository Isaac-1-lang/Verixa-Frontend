"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles } from 'lucide-react';
import AuthBackground from '@/app/components/auth/AuthBackground';
import AuthInput from '@/app/components/auth/AuthInput';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors._root) setErrors(prev => ({ ...prev, _root: undefined }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email: formData.email, password: formData.password }).unwrap();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const message =
        error?.data?.message ||
        error?.data?.error ||
        (error?.status === 401 || error?.status === 403
          ? "Invalid email or password"
          : "Login failed. Please try again.");
      setErrors({ _root: message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left decorative blob for form side */}
      <div className="hidden md:block fixed top-0 right-0 w-[30%] h-[30%] pointer-events-none z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.03]">
          <defs>
            <radialGradient id="formGlowL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A264A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A264A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="200" fill="url(#formGlowL)" />
        </svg>
      </div>
      <motion.div
        className="hidden md:block fixed bottom-8 left-[52%] pointer-events-none z-0"
        animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Shield size={32} className="text-navy/10" />
      </motion.div>
      <motion.div
        className="hidden md:block fixed top-20 right-[8%] pointer-events-none z-0"
        animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={24} className="text-navy/10" />
      </motion.div>

      <div className="hidden md:flex md:w-1/2 h-screen sticky top-0">
        <AuthBackground
          title="The Standard for Professional Quality Control"
          subtitle="Verixa provides the elite toolkit for modern QA teams."
        />
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-[60px] bg-white relative">
        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile Logo */}
          <div className="md:hidden mb-10 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shadow-lg shadow-navy/10">
                <img src="/logo.png" alt="Verixa" className="w-5 h-5 brightness-0 invert" />
              </div>
              <span className="text-navy text-xl font-bold tracking-tight">VERIXA</span>
            </Link>
          </div>

          <div className="mb-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-navy/5 rounded-2xl border border-navy/10 flex items-center justify-center mb-4 mx-auto md:mx-0"
            >
              <Shield size={22} className="text-navy" />
            </motion.div>
            <h1 className="text-3xl font-bold text-navy leading-tight mb-1.5">
              Sign In
            </h1>
            <p className="text-sm font-medium text-navy/40 mb-3">
              Enter your credentials to access the platform.
            </p>
            <div className="h-0.5 w-10 bg-navy rounded-full mx-auto md:mx-0 shadow-lg shadow-navy/20" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errors._root && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-semibold">
                {errors._root}
              </div>
            )}

            <AuthInput
              label="Email Address"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              error={errors.email}
              placeholder="name@company.com"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <AuthInput
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange(e, 'password')}
                error={errors.password}
                placeholder="••••••••"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-navy/20 hover:text-navy transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="flex justify-end px-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-navy/40 hover:text-navy transition-all"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#131B34' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full h-[52px] bg-navy text-white rounded-xl font-bold text-sm shadow-xl shadow-navy/20 flex items-center justify-center gap-3 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="opacity-40" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-navy/40 mt-8 font-medium">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-navy font-bold hover:underline transition-all">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
