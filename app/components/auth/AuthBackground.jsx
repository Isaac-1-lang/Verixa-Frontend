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
        </div>
    );
}

