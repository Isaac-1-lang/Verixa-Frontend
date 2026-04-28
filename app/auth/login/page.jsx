"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLoginMutation } from '../../redux/api/UserApiSlice';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

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
      const response = await login(formData).unwrap();
      
      // Store JWT token from response
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('tokenType', response.tokenType || 'Bearer');
      }
      
      setErrors({});
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.data?.message) {
        newErrors._root = error.data.message;
      } else if (error.status === 401) {
        newErrors._root = "Invalid email or password";
      } else if (error.status === 403) {
        newErrors._root = "Access denied. Please contact administrator.";
      } else {
        newErrors._root = "Login failed. Please try again.";
      }
      setErrors(newErrors);
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors._root) setErrors(prev => ({ ...prev, _root: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-zinc-50 to-zinc-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[960px] bg-white rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-900/5 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT — Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-14">
          <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] mb-10 block tracking-tight">
            Verixa
          </Link>

          <h2 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">Welcome back</h2>
          <p className="text-sm text-zinc-600 mb-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[var(--primary)] font-semibold hover:underline">Sign Up</Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {errors._root && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {errors._root}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange(e, 'email')}
                className={`w-full rounded-xl px-4 py-3 text-sm border-2 transition-all ${
                  errors.email 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                } outline-none`}
                placeholder="your.email@company.com"
                disabled={isLoading}
              />
              {errors.email && <span className="text-xs text-red-600 font-medium mt-1.5 block">{errors.email}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                  Forgot Password?
                </Link>
              </div>
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
                  placeholder="Enter your password"
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
              {errors.password && <span className="text-xs text-red-600 font-medium mt-1.5 block">{errors.password}</span>}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 accent-[var(--primary)] cursor-pointer rounded border-zinc-300"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-zinc-600 font-medium cursor-pointer select-none">
                Keep me logged in
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
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
              Quality Assurance<br/>Made Simple
            </h3>
            <p className="text-sm text-zinc-600 max-w-xs mx-auto leading-relaxed">
              Access your UAT dashboard, manage test cases, track executions, and ensure quality with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}