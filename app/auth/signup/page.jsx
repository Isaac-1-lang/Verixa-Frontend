"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { ArrowRight, Eye, EyeOff, Check, Shield, AlertCircle, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [requirements, setRequirements] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const pass = formData.password;
    setRequirements({
      length: pass.length >= 8,
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    });
  }, [formData.password]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!requirements.length || !requirements.lower || !requirements.upper || !requirements.number || !requirements.special) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        };

        const response = await registerUser(payload).unwrap();

        // Store token if returned
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('tokenType', response.tokenType || 'Bearer');
        }

        router.push('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);

        if (error.data?.fieldErrors) {
          setErrors(error.data.fieldErrors);
        } else if (error.data?.message) {
          setErrors({ _root: error.data.message });
        } else if (error.status === 409) {
          setErrors({ _root: "An account with this email already exists" });
        } else {
          setErrors({ _root: "Registration failed. Please try again." });
        }
      }
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors._root) setErrors(prev => ({ ...prev, _root: undefined }));
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-offwhite relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-5 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-navy opacity-[0.03] rounded-md blur-[150px] pointer-events-none"
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

          <h2 className="text-5xl font-bold text-navy mb-4  leading-tight">Create Workspace</h2>
          <p className="text-navy/40 text-sm font-medium mb-12">
            Already have an account? <Link href="/auth/login" className="text-navy font-bold hover:underline">Log in to Hive</Link>
          </p>

          {errors._root && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-md text-xs font-bold flex items-center gap-3"
            >
              <AlertCircle size={14} className="text-red-400" />
              <span>Error: {errors._root}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignUp} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-navy/40 ml-2">First Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange(e, 'firstName')}
                    className={`w-full rounded-md pl-16 pr-8 py-5 text-sm font-bold border transition-all ${errors.firstName
                      ? 'border-red-200 bg-red-50/30 text-navy'
                      : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                      } outline-none placeholder:text-navy/20`}
                    placeholder="First Name"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-navy/40 ml-2">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange(e, 'lastName')}
                    className={`w-full rounded-md pl-16 pr-8 py-5 text-sm font-bold border transition-all ${errors.lastName
                      ? 'border-red-200 bg-red-50/30 text-navy'
                      : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                      } outline-none placeholder:text-navy/20`}
                    placeholder="Last Name"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy/40 ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, 'email')}
                  placeholder="Enter your email"
                  className={`w-full rounded-md pl-16 pr-8 py-5 text-sm font-bold border transition-all ${errors.email
                    ? 'border-red-200 bg-red-50/30 text-navy'
                    : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                    } outline-none placeholder:text-navy/20`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500 font-bold ml-4">{errors.email}</span>}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy/40 ml-2">Password</label>
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { label: '8+ Chars', met: requirements.length },
                  { label: 'Lowercase', met: requirements.lower },
                  { label: 'Uppercase', met: requirements.upper },
                  { label: 'Numeric', met: requirements.number },
                  { label: 'Symbol', met: requirements.special },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${r.met ? 'bg-navy border-navy' : 'bg-transparent border-navy/10'
                      }`}>
                      {r.met && <Check size={10} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className={`text-[10px] font-bold transition-colors ${r.met ? 'text-navy' : 'text-navy/20'}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy/40 ml-2">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy transition-colors" size={18} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange(e, 'confirmPassword')}
                  className={`w-full rounded-md pl-16 pr-8 py-5 text-sm font-bold border transition-all ${errors.confirmPassword
                    ? 'border-red-200 bg-red-50/30 text-navy'
                    : 'border-navy/10 bg-offwhite text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5'
                    } outline-none placeholder:text-navy/20`}
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <span className="text-[10px] text-red-500 font-bold ml-4">{errors.confirmPassword}</span>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-6 rounded-md font-bold text-sm flex items-center justify-center gap-4 mt-8 bg-navy text-white transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'} <ArrowRight size={20} />
            </motion.button>
          </form>
        </div>

        {/* RIGHT — Brand Panel */}
        <div className="hidden lg:flex w-1/2 bg-offwhite relative items-center justify-center p-24 border-l border-navy/5 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-navy/5 rotate-12 blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 bg-white rounded-md border border-navy/10 flex items-center justify-center shadow-2xl mb-12 mx-auto"
            >
              <Shield className="text-navy" size={60} strokeWidth={1} />
            </motion.div>
            <h3 className="text-4xl font-bold text-navy mb-8 leading-tight ">
              Start Quality<br />Control Now.
            </h3>
            <p className="text-sm text-navy/40 font-medium max-w-xs mx-auto leading-relaxed">
              Access the high-performance UAT environment. Secure your deployment vector today with Verixa.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}