"use client";

import { motion } from 'framer-motion';
import { Shield, Star, Zap, Users, BarChart3 } from 'lucide-react';

const features = [
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: Zap, text: 'Real-time test execution' },
    { icon: Users, text: 'Built for elite QA teams' },
    { icon: BarChart3, text: 'Advanced analytics & reporting' },
];

export default function AuthBackground({ title, subtitle }) {
    return (
        <div className="relative w-full h-full bg-navy overflow-hidden flex flex-col justify-between p-12 xl:p-16">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.svg
                    viewBox="0 0 900 900"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute w-[130%] h-[130%] -top-[15%] -left-[15%] text-[#1e2e5e] opacity-50"
                    animate={{ x: ["-1%", "1%", "-1%"] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                >
                    <path
                        fill="currentColor"
                        d="M782,589Q700,728,558,792Q416,856,292,756Q168,656,120,520Q72,384,172,268Q272,152,420,140Q568,128,684,230Q800,332,832,466Q864,600,782,589Z"
                    />
                </motion.svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex items-center gap-3"
            >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-18 h-14" />
                </div>
                <span className="text-white font-extrabold text-4xl tracking-tight">VERIXA</span>
            </motion.div>

            <div className="relative z-10 flex flex-col gap-8 my-auto py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                >
                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
                        {title}
                    </h1>
                    <p className="text-white/60 text-lg xl:text-xl font-normal max-w-md">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Feature list */}
                <motion.ul
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.9 }}
                    className="flex flex-col gap-4"
                >
                    {features.map(({ icon: Icon, text }, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                <Icon size={15} className="text-white/80" />
                            </div>
                            <span className="text-white/70 text-[15px] font-semibold">{text}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            {/* Bottom — Testimonial card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="relative z-10 bg-white/0.06 border border-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
                <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={13} className="fill-white text-white opacity-70" />
                    ))}
                </div>
                <p className="text-white/75 text-[15px] font-medium leading-relaxed mb-4">
                    "Verixa transformed how our team manages QA. The clarity and control it provides is simply unmatched."
                </p>
                <div className="flex items-center gap-3">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=72&backgroundColor=ffffff`}
                        alt="Testimonial"
                        className="w-9 h-9 rounded-full border border-white/20 bg-white/10"
                    />
                    <div>
                        <p className="text-white font-bold text-sm">Sarah Mitchell</p>
                        <p className="text-white/40 text-[12px] font-medium">Head of QA, Nexora Labs</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
