"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthInput from '@/app/components/auth/AuthInput';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
            {/* Dot Pattern Texture */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[440px] bg-white rounded-[20px] p-12 shadow-2xl relative z-10"
            >
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mb-6">
                                    <Lock className="text-navy" size={40} strokeWidth={1.5} />
                                </div>
                                <h1 className="text-[28px] font-semibold text-navy mb-3">
                                    Forgot your password?
                                </h1>
                                <p className="text-[14px] text-navy/60 max-w-[280px]">
                                    Enter your registered email and we'll send you a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AuthInput
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    error={error}
                                    placeholder="name@company.com"
                                    disabled={isLoading}
                                />

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
                                        'Send Reset Link'
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-navy hover:opacity-70 transition-opacity"
                                >
                                    <ArrowLeft size={16} />
                                    Back to sign in
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle2 className="text-green-500" size={48} strokeWidth={1.5} />
                                </motion.div>
                                <h1 className="text-[28px] font-semibold text-navy mb-3">
                                    Check your email
                                </h1>
                                <p className="text-[14px] text-navy/60 max-w-[280px] mb-10">
                                    We've sent a password reset link to <span className="font-semibold text-navy">{email}</span>.
                                </p>

                                <Link
                                    href="/auth/login"
                                    className="w-full h-[52px] bg-navy text-white rounded-xl font-semibold text-[16px] tracking-[0.5px] flex items-center justify-center hover:bg-[#243058] transition-colors"
                                >
                                    Return to sign in
                                </Link>

                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-6 text-[14px] font-medium text-navy/40 hover:text-navy"
                                >
                                    Didn't receive the email? Try again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
