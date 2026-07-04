"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Sparkles, Fingerprint } from 'lucide-react';
import AuthBackground from '@/app/components/auth/AuthBackground';
import AuthInput from '@/app/components/auth/AuthInput';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const pass = formData.password;
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    setStrength(s);
  }, [formData.password]);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors._root) setErrors(prev => ({ ...prev, _root: undefined }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      };
      await registerUser(payload).unwrap();
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error (raw):', JSON.stringify(error));

      if (
        error?.status === 'NETWORK_ERROR' ||
        error?.status === 'FETCH_ERROR' ||
        error?.error
      ) {
        setErrors({ _root: 'Cannot connect to the server. Please make sure the backend is running.' });
        return;
      }

      if (error?.data?.message) {
        setErrors({ _root: error.data.message });
        return;
      }

      if (error?.data?.errors) {
        const first = Object.values(error.data.errors)[0];
        setErrors({ _root: Array.isArray(first) ? first[0] : first });
        return;
      }

      if (typeof error?.data === 'string' && error.data.length > 0) {
        setErrors({ _root: error.data });
        return;
      }
      if (error?.status === 409) {
        setErrors({ _root: 'An account with this email already exists.' });
        return;
      }
      if (error?.status === 400) {
        setErrors({ _root: 'Invalid registration details. Please check your inputs.' });
        return;
      }

      setErrors({ _root: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Decorative elements for form side */}
      <div className="hidden md:block fixed top-0 right-0 w-[30%] h-[30%] pointer-events-none z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.03]">
          <defs>
            <radialGradient id="formGlowS" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A264A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A264A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="200" fill="url(#formGlowS)" />
        </svg>
      </div>
      <motion.div
        className="hidden md:block fixed bottom-12 left-[52%] pointer-events-none z-0"
        animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Fingerprint size={28} className="text-navy/10" />
      </motion.div>
      <motion.div
        className="hidden md:block fixed top-28 right-[10%] pointer-events-none z-0"
        animate={{ rotate: [0, 20, 0, -20, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={22} className="text-navy/10" />
      </motion.div>

      {/* Left Panel */}
      <div className="hidden md:flex fixed left-0 top-0 w-1/2 h-screen z-10">
        <AuthBackground
          title="Join the Elite QA Community"
          subtitle="Experience the most advanced UAT management platform today."
        />
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 md:ml-[50%] flex items-center justify-center p-8 sm:p-12 lg:p-[60px] bg-white relative">
        <div className="w-full max-w-[420px] relative z-10">
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
              Create Account
            </h1>
            <p className="text-sm font-medium text-navy/40 mb-3">
              Join Verixa and start streamlining your QA today.
            </p>
            <div className="h-0.5 w-10 bg-navy rounded-full mx-auto md:mx-0 shadow-lg shadow-navy/20" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {errors._root && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-semibold">
                {errors._root}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                label="First Name"
                icon={User}
                value={formData.firstName}
                onChange={(e) => handleChange(e, 'firstName')}
                error={errors.firstName}
                placeholder="Jane"
                disabled={isLoading}
              />
              <AuthInput
                label="Last Name"
                icon={User}
                value={formData.lastName}
                onChange={(e) => handleChange(e, 'lastName')}
                error={errors.lastName}
                placeholder="Doe"
                disabled={isLoading}
              />
            </div>

            <AuthInput
              label="Email Address"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              error={errors.email}
              placeholder="jane@company.com"
              disabled={isLoading}
            />

            <div className="space-y-4">
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

              <div className="space-y-2 px-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${strength >= seg ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-navy/5'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-medium text-navy/40">
                  {strength === 0 ? 'Enter a password' : `Security: ${strength === 4 ? 'Elite' : strength >= 2 ? 'Professional' : 'Standard'}`}
                </p>
              </div>
            </div>

            <AuthInput
              label="Confirm Password"
              icon={Lock}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange(e, 'confirmPassword')}
              error={errors.confirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
            />

            <div className="flex items-start gap-3 py-1.5">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-4 h-4 rounded border border-navy/30 bg-white peer-checked:bg-navy peer-checked:border-navy transition-all duration-200 flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                </div>
              </div>
              <label htmlFor="terms" className="text-xs font-medium text-navy/40 leading-snug cursor-pointer hover:text-navy transition-colors select-none">
                I agree to the <Link href="#" className="text-navy font-semibold hover:underline">Terms</Link> and <Link href="#" className="text-navy font-semibold hover:underline">Privacy Policy</Link>
              </label>
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
                  Create Account
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-navy font-bold hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}