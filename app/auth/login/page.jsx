"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Fingerprint } from 'lucide-react';
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
      console.warn('Login failed:', error?.status, error?.data?.message || error?.error || 'Unknown error');
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
        <Fingerprint size={32} className="text-navy/10" />
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center md:justify-start gap-2 mb-4"
            >
              <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center shadow-md shadow-navy/10">
                <img src="/logo.png" alt="Verixa" className="w-5 h-5 brightness-0 invert" />
              </div>
              <span className="text-navy font-bold text-lg tracking-tight">VERIXA</span>
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-navy/30 font-medium">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-[48px] rounded-xl border border-navy/10 hover:border-navy/30 bg-white hover:bg-navy/[0.02] transition-all text-sm font-semibold text-navy/60 hover:text-navy"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-[48px] rounded-xl border border-navy/10 hover:border-navy/30 bg-white hover:bg-navy/[0.02] transition-all text-sm font-semibold text-navy/60 hover:text-navy"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-navy/40 mt-6 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-navy font-bold hover:underline transition-all">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
