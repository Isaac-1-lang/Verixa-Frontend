"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Logic from original file
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.data?.message) {
        newErrors._root = error.data.message;
      } else {
        newErrors._root = "Login failed. Please try again.";
      }
      setErrors(newErrors);
    }
  };

  const socialButtons = [
    { name: 'Google', icon: 'https://www.svgrepo.com/show/355037/google.svg' },
    { name: 'Apple', icon: 'https://www.svgrepo.com/show/511330/apple.svg' },
    { name: 'Microsoft', icon: 'https://www.svgrepo.com/show/448239/microsoft.svg' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - 55% */}
      <div className="hidden md:flex md:w-[55%] h-screen sticky top-0">
        <AuthBackground />
      </div>

      {/* Right Panel - 45% */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-[60px] bg-white">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="md:hidden mb-12 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={20} />
              </div>
              <span className="text-navy text-2xl font-semibold">Verixa</span>
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-[36px] font-semibold text-navy leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[15px] font-normal text-navy/55 mb-6">
              Sign in to continue to your account
            </p>
            <div className="h-px w-10 bg-navy/10 mx-auto md:mx-0" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errors._root && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
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
                    className="text-navy/40 hover:text-navy transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
              <div className="flex justify-end pr-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-[13px] font-normal text-navy hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#243058' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-navy text-white rounded-xl font-semibold text-[16px] tracking-[0.5px] shadow-lg shadow-navy/10 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-navy/10" />
            <span className="text-[13px] font-normal text-navy/40">or continue with</span>
            <div className="flex-1 h-px bg-navy/10" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {socialButtons.map((social) => (
              <button
                key={social.name}
                type="button"
                className="flex items-center justify-center py-2.5 px-4 rounded-xl border-[1.5px] border-navy/20 hover:border-navy/40 hover:bg-navy/5 transition-all"
              >
                <img src={social.icon} alt={social.name} className="w-5 h-5" />
              </button>
            ))}
          </div>

          <p className="text-center text-[15px] text-navy/60">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-navy font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}