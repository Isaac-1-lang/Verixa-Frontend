"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
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
  const [strength, setStrength] = useState(0); // 0 to 4

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
    else if (strength < 4) newErrors.password = "Password is too weak";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      await registerUser(payload).unwrap();
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.data?.message) {
        setErrors({ _root: error.data.message });
      } else {
        setErrors({ _root: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - 55% */}
      <div className="hidden md:flex md:w-[55%] h-screen sticky top-0">
        <AuthBackground />
      </div>

      {/* Right Panel - 45% */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-[60px] bg-white">
        <div className="w-full max-w-[440px]">
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-navy leading-tight mb-4 tracking-tight">
              Create an account
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-navy/30 mb-8 ml-1">
              Join the elite Verixa QA community
            </p>
            <div className="h-1 w-12 bg-navy rounded-full mx-auto md:mx-1 shadow-lg shadow-navy/20" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {errors._root && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[12px] font-black uppercase tracking-wider">
                {errors._root}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Password Strength Indicator */}
              <div className="space-y-3 px-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${strength >= seg ? 'bg-navy shadow-[0_0_10px_rgba(26,38,74,0.2)]' : 'bg-navy/5'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">
                  Security Grade: {strength === 4 ? 'Elite' : strength >= 2 ? 'Professional' : 'Standard'}
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

            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-5 h-5 rounded-md border-navy/10 text-navy focus:ring-navy cursor-pointer accent-navy"
                />
              </div>
              <label htmlFor="terms" className="text-[12px] font-bold text-navy/40 leading-tight cursor-pointer hover:text-navy transition-colors">
                I agree to the <Link href="#" className="text-navy font-black hover:underline">Terms</Link> and <Link href="#" className="text-navy font-black hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#131B34' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-[60px] bg-navy text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 flex items-center justify-center gap-3 transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  'Create Account'
                  <ArrowRight size={18} className="opacity-40" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-[15px] text-navy/60 mt-10">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-navy font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}