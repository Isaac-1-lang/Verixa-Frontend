"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
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
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-[36px] font-semibold text-navy leading-tight mb-2">
              Create your account
            </h1>
            <p className="text-[15px] font-normal text-navy/55 mb-6">
              Join Verixa today and streamline your QA
            </p>
            <div className="h-px w-10 bg-navy/10 mx-auto md:mx-0" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {errors._root && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
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

            <div className="space-y-3">
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

              {/* Password Strength Indicator */}
              <div className="flex gap-1.5 px-1 py-1">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= seg ? 'bg-navy' : 'bg-navy/10'
                      }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-navy/40 px-1">
                Must be at least 8 characters with upper, lower, numbers & symbols.
              </p>
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
                  className="w-5 h-5 rounded border-navy/20 text-navy focus:ring-navy cursor-pointer accent-navy"
                />
              </div>
              <label htmlFor="terms" className="text-[13px] text-navy/60 leading-tight cursor-pointer">
                I agree to the <Link href="#" className="text-navy font-semibold hover:underline">Terms of Service</Link> and <Link href="#" className="text-navy font-semibold hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#243058' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-navy text-white rounded-xl font-semibold text-[16px] tracking-[0.5px] shadow-lg shadow-navy/10 flex items-center justify-center gap-2 transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
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