"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Terminal, ArrowRight, ShieldAlert } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Scanning Elements */}
            <div className="absolute inset-0 dot-grid opacity-[0.05]" />

            {/* Animated Scanning Line */}
            <motion.div
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-px bg-white/10 z-0 pointer-events-none"
            />

            {/* Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy opacity-20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* Glitchy 404 Header */}
                    <div className="relative mb-12">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[120px] md:text-[180px] font-bold text-white leading-none tracking-tighter"
                        >
                            404
                        </motion.h1>

                        {/* Glitch Overlay 1 */}
                        <motion.h1
                            animate={{
                                x: [-2, 2, -1, 0, 1],
                                opacity: [0, 0.5, 0.2, 0.8, 0]
                            }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                            className="absolute inset-0 text-[120px] md:text-[180px] font-bold text-emerald-500/50 leading-none tracking-tighter pointer-events-none mix-blend-screen"
                        >
                            404
                        </motion.h1>

                        {/* Glitch Overlay 2 */}
                        <motion.h1
                            animate={{
                                x: [2, -2, 1, 0, -1],
                                opacity: [0, 0.3, 0.5, 0.1, 0]
                            }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
                            className="absolute inset-0 text-[120px] md:text-[180px] font-bold text-red-500/50 leading-none tracking-tighter pointer-events-none mix-blend-screen"
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
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Defective Route Detected</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Segment Not Found</h2>
                        <p className="text-white/40 text-lg font-medium max-w-md mx-auto">
                            The requested environment path could not be validated in the current UAT cycle.
                        </p>
                    </motion.div>

                    {/* Terminal Diagnostics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-6 mb-12 text-left font-mono"
                    >
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                            <Terminal size={14} className="text-white/40" />
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">UAT_SCAN_LOG_V2.0</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex gap-3">
                                <span className="text-white/20 whitespace-nowrap">09:41:22</span>
                                <span className="text-emerald-500">Initializing UAT Route Scan...</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-white/20 whitespace-nowrap">09:41:23</span>
                                <span className="text-white/60">Checking segment protocols [OK]</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-white/20 whitespace-nowrap">09:41:24</span>
                                <span className="text-red-500">CRITICAL: ERROR_PATH_DEFECTIVE</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-white/20 whitespace-nowrap">09:41:24</span>
                                <span className="text-white/60">Terminating request... [DONE]</span>
                            </div>
                            <motion.div
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-2 h-4 bg-white/40 mt-2"
                            />
                        </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            href="/"
                            className="group bg-white text-navy px-10 py-5 rounded-md font-bold text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
                        >
                            Return to Control Panel
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                </div>
            </div>

            {/* Side Accents */}
            <div className="absolute top-12 left-12 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                </div>
                <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Verixa Operations</span>
            </div>
        </div>
    );
}
