"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="max-w-2xl w-full relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* Glitchy 404 Header */}
                    <div className="relative mb-12">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[120px] md:text-[300px] font-bold text-white leading-none tracking-tighter"
                        >
                            404
                        </motion.h1>
                    </div>

                    {/* Title & Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md mb-4">
                            <ShieldAlert size={14} className="text-red-500" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Route Not Found</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Segment Not Found</h2>
                        <p className="text-white/40 text-lg font-medium max-w-md mx-auto">
                            The requested environment path could not be validated in the current UAT cycle.
                        </p>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            href="/"
                            className="group bg-white text-navy px-8 py-4 rounded-md font-bold text-md flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
                        >
                            Back To Home
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                </div>
            </div>

        </div>
    );
}
