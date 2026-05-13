"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../redux/api/UserApiSlice';
import { ArrowRight, Eye, EyeOff, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // Basic validation
    if (!formData.fullName?.trim()) {
      toast.error("Full name is required");
      return;
    }
    
    if (formData.fullName.trim().length > 120) {
      toast.error("Full name must be 120 characters or less");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    
    if (formData.email.length > 160) {
      toast.error("Email must be 160 characters or less");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    } else if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    } else if (formData.password.length > 120) {
      toast.error("Password must be 120 characters or less");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      // Backend expects: fullName, email, password
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      const response = await registerUser(payload).unwrap();
      
      toast.success("Account created successfully! Please login.");
      
      // Backend doesn't return token on registration
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors from backend
      if (error.data?.violations && Array.isArray(error.data.violations)) {
        error.data.violations.forEach(violation => {
          toast.error(`${violation.field}: ${violation.message}`);
        });
      } else if (error.data?.message) {
        toast.error(error.data.message);
      } else if (error.status === 409) {
        toast.error("An account with this email already exists");
      } else if (error.status === 400) {
        toast.error("Invalid registration data. Please check your inputs.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
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

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => handleChange(e, 'fullName')}
                className="w-full rounded-xl px-4 py-3 text-sm border-2 border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                placeholder="John Doe"
                maxLength={120}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange(e, 'email')} 
                placeholder="john.doe@company.com"
                className="w-full rounded-xl px-4 py-3 text-sm border-2 border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                maxLength={160}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => handleChange(e, 'password')}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm border-2 border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                  placeholder="Create a strong password (min 8 characters)"
                  minLength={8}
                  maxLength={120}
                  disabled={isLoading}
                  required
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
                className="w-full rounded-xl px-4 py-3 text-sm border-2 border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                placeholder="Re-enter your password"
                disabled={isLoading}
                required
              />
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