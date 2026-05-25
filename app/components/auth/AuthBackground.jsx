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
                        fillOpacity="0.15"
                        d="M820,560Q740,720,590,790Q440,860,300,750Q160,640,130,495Q100,350,200,238Q300,126,458,122Q616,118,722,226Q828,334,848,447Q868,560,820,560Z"
                    />

                    <path
                        fill="currentColor"
                        fillOpacity="0.55"
                        d="M782,589Q700,728,558,792Q416,856,292,756Q168,656,120,520Q72,384,172,268Q272,152,420,140Q568,128,684,230Q800,332,832,466Q864,600,782,589Z"
                    />

                    <path
                        fill="currentColor"
                        fillOpacity="0.30"
                        d="M720,560Q660,670,550,710Q440,750,340,680Q240,610,220,500Q200,390,280,310Q360,230,470,228Q580,226,660,310Q740,394,748,477Q756,560,720,560Z"
                    />

                    {/* Top-right accent */}
                    <path
                        fill="currentColor"
                        fillOpacity="0.25"
                        d="M760,130Q800,90,840,130Q880,170,850,220Q820,270,770,260Q720,250,700,200Q680,150,760,130Z"
                    />

                    {/* Bottom-left accent */}
                    <path
                        fill="currentColor"
                        fillOpacity="0.25"
                        d="M150,730Q100,770,100,830Q100,890,160,890Q220,890,250,840Q280,790,250,750Q220,710,150,730Z"
                    />

                    {/* Small circle — top center */}
                    <circle fill="currentColor" fillOpacity="0.20" cx="450" cy="155" r="55"/>

                    {/* Small circle — bottom right */}
                    <circle fill="currentColor" fillOpacity="0.18" cx="730" cy="750" r="42"/>

                    {/* Small circle — left */}
                    <circle fill="currentColor" fillOpacity="0.15" cx="128" cy="430" r="34"/>
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
        </div>
    );
}
