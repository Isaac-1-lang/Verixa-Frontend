"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { ArrowRight, Eye, EyeOff, Check, Shield, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-zinc-50 to-zinc-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] bg-white rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-900/5 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT — Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12">
          <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] mb-8 block tracking-tight">
            Verixa
          </Link>

          <h2 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">Create your account</h2>
          <p className="text-sm text-zinc-600 mb-7">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[var(--primary)] font-semibold hover:underline">Log In</Link>
          </p>

          {errors._root && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{errors._root}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => handleChange(e, 'firstName')}
                  className={`w-full rounded-xl px-4 py-3 text-sm border-2 transition-all ${
                    errors.firstName 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  } outline-none`}
                  placeholder="Verixa"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => handleChange(e, 'lastName')}
                  className={`w-full rounded-xl px-4 py-3 text-sm border-2 transition-all ${
                    errors.lastName 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  } outline-none`}
                  placeholder="Verixa"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange(e, 'email')} 
                placeholder="john.doe@company.com"
                className={`w-full rounded-xl px-4 py-3 text-sm border-2 transition-all ${
                  errors.email 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                } outline-none`}
                disabled={isLoading}
              />
              {errors.email && <span className="text-xs text-red-600 font-medium mt-1.5 block">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => handleChange(e, 'password')}
                  className={`w-full rounded-xl px-4 py-3 pr-11 text-sm border-2 transition-all ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  } outline-none`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: '8+ characters', met: requirements.length },
                  { label: 'Lowercase', met: requirements.lower },
                  { label: 'Uppercase', met: requirements.upper },
                  { label: 'Number', met: requirements.number },
                  { label: 'Special char', met: requirements.special },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      r.met ? 'bg-emerald-500' : 'bg-zinc-200'
                    }`}>
                      {r.met && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-xs font-medium ${r.met ? 'text-emerald-600' : 'text-zinc-500'}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Confirm Password</label>
              <input 
                type="password" 
                value={formData.confirmPassword} 
                onChange={(e) => handleChange(e, 'confirmPassword')}
                className={`w-full rounded-xl px-4 py-3 text-sm border-2 transition-all ${
                  errors.confirmPassword 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                } outline-none`}
                placeholder="Re-enter your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="text-xs text-red-600 font-medium mt-1.5 block">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* RIGHT — Brand Panel */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-zinc-50 to-zinc-100 relative items-center justify-center p-14">
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-8 mx-auto border border-zinc-200">
              <Shield className="text-[var(--primary)]" size={40} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 mb-3 leading-tight tracking-tight">
              Join Verixa<br/>Today
            </h3>
            <p className="text-sm text-zinc-600 max-w-xs mx-auto leading-relaxed">
              Start managing your UAT processes with confidence. Execute tests, track defects, and ensure quality across your projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}