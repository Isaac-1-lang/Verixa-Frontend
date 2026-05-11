"use client";

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Image from 'next/image';

const FeaturePill = ({ text, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`absolute px-4 py-2 rounded-full border border-white bg-navy text-white text-[13px] font-medium shadow-lg ${className}`}
    >
        {text}
    </motion.div>
);

export default function AuthBackground({ logoOnly = false }) {
    return (
        <div className="relative w-full h-full bg-navy overflow-hidden flex flex-col items-center justify-center">
            {/* Dot Pattern Texture */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Abstract Wavy SVG Shape */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.svg
                    viewBox="0 0 1000 1000"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] text-[#243058] opacity-40"
                    animate={{
                        x: ["-1%", "1%", "-1%"],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <path
                        fill="currentColor"
                        d="M826,628Q719,756,589,836Q459,916,331,811Q203,706,145.5,556.5Q88,407,192,291.5Q296,176,432,159.5Q568,143,694.5,232.5Q821,322,877,461Q933,600,826,628Z"
                    />
                </motion.svg>
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-12">
                <div className="mb-6 flex flex-col items-center">
                    <Link href="/" className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                            <Shield className="text-navy" size={36} strokeWidth={1.5} />
                        </div>
                        <span className="text-white text-3xl font-semibold tracking-tight">Verixa</span>
                    </Link>
                </div>
                {!logoOnly && (
                    <p className="text-white/60 text-lg font-normal max-w-sm">
                        Quality Unified. Engineered QA.
                    </p>
                )}
            </div>

            {/* Floating Feature Pills */}
            {!logoOnly && (
                <>
                    <FeaturePill
                        text="Secure & Encrypted"
                        className="top-[20%] left-[15%]"
                    />
                    <FeaturePill
                        text="Real-time Collaboration"
                        className="bottom-[30%] right-[10%]"
                    />
                    <FeaturePill
                        text="AI-Powered Insights"
                        className="bottom-[15%] left-[25%]"
                    />
                </>
            )}
        </div>
    );
}

import Link from 'next/link';
