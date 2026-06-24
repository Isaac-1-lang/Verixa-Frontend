"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, Users, BarChart3, Sparkles } from 'lucide-react';

const features = [
  { icon: Shield, text: 'Enterprise-grade security' },
  { icon: Zap, text: 'Real-time test execution' },
  { icon: Users, text: 'Built for elite QA teams' },
  { icon: BarChart3, text: 'Advanced analytics & reporting' },
];

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6,
}));

const gridLines = Array.from({ length: 8 }, (_, i) => i);

export default function AuthBackground({ title, subtitle }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0B1121] via-[#111B3A] to-[#1A264A] overflow-hidden flex flex-col justify-between p-12 xl:p-16">
      {/* ── Base dot grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ── Animated grid lines ── */}
      {gridLines.map((i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{ top: `${(i + 1) * 12.5}%` }}
          animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [1, 1.1, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
      {gridLines.map((i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
          style={{ left: `${(i + 1) * 12.5}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2], scaleY: [1, 1.1, 1] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Floating glowing particles ── */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.id % 2 === 0 ? 15 : -15, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Main organic blob shapes ── */}
      <motion.svg
        viewBox="0 0 900 900"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%]"
        animate={{ rotate: [0, 5, 0, -3, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <radialGradient id="blobGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        {/* Large ambient glow */}
        <circle cx="450" cy="450" r="350" fill="url(#blobGlow)" filter="url(#blur1)" />

        <motion.path
          fill="currentColor"
          fillOpacity="0.12"
          className="text-blue-400"
          d="M820,560Q740,720,590,790Q440,860,300,750Q160,640,130,495Q100,350,200,238Q300,126,458,122Q616,118,722,226Q828,334,848,447Q868,560,820,560Z"
          animate={{ d: [
            'M820,560Q740,720,590,790Q440,860,300,750Q160,640,130,495Q100,350,200,238Q300,126,458,122Q616,118,722,226Q828,334,848,447Q868,560,820,560Z',
            'M800,580Q720,740,580,780Q440,820,290,710Q140,600,120,480Q100,360,210,250Q320,140,460,130Q600,120,710,230Q820,340,830,460Q840,580,800,580Z',
            'M820,560Q740,720,590,790Q440,860,300,750Q160,640,130,495Q100,350,200,238Q300,126,458,122Q616,118,722,226Q828,334,848,447Q868,560,820,560Z',
          ]}}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          fill="currentColor"
          fillOpacity="0.08"
          className="text-indigo-400"
          d="M782,589Q700,728,558,792Q416,856,292,756Q168,656,120,520Q72,384,172,268Q272,152,420,140Q568,128,684,230Q800,332,832,466Q864,600,782,589Z"
          animate={{ d: [
            'M782,589Q700,728,558,792Q416,856,292,756Q168,656,120,520Q72,384,172,268Q272,152,420,140Q568,128,684,230Q800,332,832,466Q864,600,782,589Z',
            'M750,570Q680,710,550,760Q420,810,300,730Q180,650,140,520Q100,390,200,290Q300,190,430,170Q560,150,670,250Q780,350,790,460Q800,570,750,570Z',
            'M782,589Q700,728,558,792Q416,856,292,756Q168,656,120,520Q72,384,172,268Q272,152,420,140Q568,128,684,230Q800,332,832,466Q864,600,782,589Z',
          ]}}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          fill="currentColor"
          fillOpacity="0.06"
          className="text-purple-300"
          d="M720,560Q660,670,550,710Q440,750,340,680Q240,610,220,500Q200,390,280,310Q360,230,470,228Q580,226,660,310Q740,394,748,477Q756,560,720,560Z"
          animate={{ d: [
            'M720,560Q660,670,550,710Q440,750,340,680Q240,610,220,500Q200,390,280,310Q360,230,470,228Q580,226,660,310Q740,394,748,477Q756,560,720,560Z',
            'M740,540Q680,650,560,690Q440,730,320,670Q200,610,190,490Q180,370,270,290Q360,210,480,210Q600,210,690,300Q780,390,780,465Q780,540,740,540Z',
            'M720,560Q660,670,550,710Q440,750,340,680Q240,610,220,500Q200,390,280,310Q360,230,470,228Q580,226,660,310Q740,394,748,477Q756,560,720,560Z',
          ]}}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Decorative corner blobs */}
        <motion.circle
          fill="currentColor" fillOpacity="0.1" className="text-blue-300"
          cx="120" cy="140" r="80"
          animate={{ cx: [120, 140, 100, 120], cy: [140, 120, 160, 140] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          fill="currentColor" fillOpacity="0.08" className="text-indigo-300"
          cx="800" cy="780" r="60"
          animate={{ cx: [800, 770, 820, 800], cy: [780, 800, 750, 780] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>

      {/* ── Gradient edge overlays for depth ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1121]/40 via-transparent to-[#0B1121]/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1121]/20 via-transparent to-[#0B1121]/20 pointer-events-none" />

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center gap-3"
      >
        <motion.div
          className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <img src="/logo.png" alt="Logo" className="w-10 h-10 brightness-0 invert" />
        </motion.div>
        <span className="text-white font-bold text-3xl tracking-tight">VERIXA</span>
        <motion.div
          animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={18} className="text-blue-300 ml-1" />
        </motion.div>
      </motion.div>

      <div className="relative z-10 flex flex-col gap-8 my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-white/50 text-base xl:text-lg font-normal max-w-md leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

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
              transition={{ delay: 0.5 + i * 0.12, duration: 0.7 }}
              className="flex items-center gap-3 group"
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Icon size={14} className="text-white/60 group-hover:text-white/90 transition-colors" />
              </motion.div>
              <span className="text-white/50 text-sm font-medium group-hover:text-white/80 transition-colors">{text}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* ── Bottom decorative bar ── */}
      <motion.div
        className="relative z-10 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>
    </div>
  );
}
