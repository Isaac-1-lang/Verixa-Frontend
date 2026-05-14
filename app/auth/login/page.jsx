"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthBackground from '@/app/components/auth/AuthBackground';
import AuthInput from '@/app/components/auth/AuthInput';
import toast from 'react-hot-toast';

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
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.data?.message) {
        newErrors._root = error.data.message;
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-[55%] h-screen sticky top-0">
        <AuthBackground
          title="The Standard for Professional Quality Control"
          subtitle="Verixa provides the elite toolkit for modern QA teams."
        />
      </div>

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

          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-2">
              Sign In
            </h1>
            <p className="text-md font-medium text-navy/40 mb-2 ml-1">
              Enter your credentials to access the platform.
            </p>
            <div className="h-1 w-12 bg-navy rounded-full mx-auto md:mx-1 shadow-lg shadow-navy/20" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errors._root && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              whileHover={{ scale: 1.02, backgroundColor: '#131B34' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-[60px] bg-navy text-white rounded-xl font-bold text-sm shadow-2xl shadow-navy/20 flex items-center justify-center gap-3 transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="opacity-40" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-navy/40 mt-10 font-medium">
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