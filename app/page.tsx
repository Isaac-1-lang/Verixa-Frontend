"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ChevronRight, Layers, Users, TrendingUp, Shield, 
  Zap, Globe, Check, Menu, X, BarChart3, BookOpen
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const FIELDS = [
  { name: 'Software Testing', color: '#4CAF50' },
  { name: 'Quality Assurance', color: '#FF5C8D' },
  { name: 'DevOps', color: '#6C63FF' },
  { name: 'Enterprise Apps', color: '#FFA726' },
  { name: 'Mobile Apps', color: '#EF5350' },
  { name: 'Web Applications', color: '#AB47BC' },
  { name: 'Cloud Services', color: '#FFD54F' },
  { name: 'API Testing', color: '#5C6BC0' },
  { name: 'Performance Testing', color: '#29B6F6' },
  { name: 'Security Testing', color: '#66BB6A' },
];

const FEATURES = [
  { icon: <Layers size={24} />, title: 'Test Case Management', desc: 'Create, organize, and manage comprehensive test cases with detailed steps, expected results, and traceability to requirements.' },
  { icon: <Users size={24} />, title: 'Execution Tracking', desc: 'Execute tests, record results, and track progress in real-time. Assign executions to team members and monitor completion status.' },
  { icon: <TrendingUp size={24} />, title: 'Defect Management', desc: 'Log defects with severity levels, attach evidence, and track resolution. Link defects to test executions for full traceability.' },
  { icon: <Shield size={24} />, title: 'Quality Sign-Off', desc: 'Formal approval workflow for test runs. Managers can review results and sign-off when quality gates are met.' },
  { icon: <BarChart3 size={24} />, title: 'Analytics Dashboard', desc: 'Track test coverage, pass/fail rates, defect trends, and project health. Visual insights for stakeholder reporting.' },
  { icon: <BookOpen size={24} />, title: 'Attachment & Evidence', desc: 'Upload screenshots, logs, and documents as test evidence. Maintain complete audit trail for compliance and reviews.' },
];

const STEPS = [
  { number: '01', title: 'Create Test Plan', desc: 'Define your project, create requirements, and organize test cases with detailed steps and expected outcomes.' },
  { number: '02', title: 'Execute & Track', desc: 'Run tests, record results, log defects, and attach evidence. Track progress across your entire test suite in real-time.' },
  { number: '03', title: 'Review & Sign-Off', desc: 'Managers review test results, approve quality gates, and formally sign-off when ready for production release.' },
];

const PRICING = [
  { name: 'Starter', price: 'Free', period: 'forever', desc: 'Perfect for small teams and pilot projects.', features: ['Up to 3 projects', 'Up to 50 test cases', 'Basic reporting', 'Email support', 'Community access'], cta: 'Get Started Free', highlighted: false },
  { name: 'Professional', price: '$99', period: '/month', desc: 'For growing QA teams managing multiple projects.', features: ['Unlimited projects', 'Unlimited test cases', 'Advanced analytics', 'Defect tracking', 'Team collaboration', 'Priority support'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations with complex requirements.', features: ['Custom deployment', 'SSO & LDAP', 'Advanced security', 'API access', 'Custom integrations', 'Dedicated support'], cta: 'Contact Sales', highlighted: false },
];

const STATS = [
  { value: '10K+', label: 'Test Cases Executed' },
  { value: '500+', label: 'Active Projects' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '24/7', label: 'Support Available' },
];

// Typing Effect
const TypingText = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Quality Assured";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else clearInterval(interval);
    }, 75);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[var(--primary)] relative inline-block font-extrabold">
      {displayText}
      <span className="animate-blink absolute -right-1 top-1/2 -translate-y-1/2 w-[4px] h-12 bg-[var(--primary)] rounded" />
    </span>
  );
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Scroll-driven hero depth
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.55]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 0.94]);
  const bgY = useTransform(scrollY, [0, 1200], [0, -180]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXProgress = useMotionValue(0.5);
  const mouseYProgress = useMotionValue(0.5);
  
  const cursorX = useSpring(x, { stiffness: 450, damping: 30 });
  const cursorY = useSpring(y, { stiffness: 450, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      mouseXProgress.set(e.clientX / window.innerWidth);
      mouseYProgress.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseXProgress, mouseYProgress]);

  // Parallax Refs
  const featuresRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Smooth Spring Configuration
  const smoothConfig = { stiffness: 80, damping: 25, mass: 0.5 };

  // Hero Card 3D Rotation
  const cardRotateXRaw = useTransform(mouseYProgress, [0, 1], [15, -15]);
  const cardRotateYRaw = useTransform(mouseXProgress, [0, 1], [-15, 15]);
  const cardRotateX = useSpring(cardRotateXRaw, smoothConfig);
  const cardRotateY = useSpring(cardRotateYRaw, smoothConfig);

  // Features Parallax
  const { scrollYProgress: fProg } = useScroll({ target: featuresRef, offset: ["start end", "end start"] });
  const fY1Raw = useTransform(fProg, [0, 1], [150, -150]);
  const fY2Raw = useTransform(fProg, [0, 1], [250, -250]);
  const fY3Raw = useTransform(fProg, [0, 1], [50, -50]);
  const fY1 = useSpring(fY1Raw, smoothConfig);
  const fY2 = useSpring(fY2Raw, smoothConfig);
  const fY3 = useSpring(fY3Raw, smoothConfig);
  const featYArr = [fY1, fY2, fY3];

  // Steps Parallax
  const { scrollYProgress: sProg } = useScroll({ target: stepsRef, offset: ["start end", "end start"] });
  const sNumYRaw = useTransform(sProg, [0, 1], [-120, 120]);
  const sNumY = useSpring(sNumYRaw, smoothConfig);

  // Pricing Parallax
  const { scrollYProgress: pProg } = useScroll({ target: pricingRef, offset: ["start end", "end start"] });
  const pY1Raw = useTransform(pProg, [0, 1], [100, -100]);
  const pY2Raw = useTransform(pProg, [0, 1], [0, 0]); 
  const pY3Raw = useTransform(pProg, [0, 1], [-100, 100]);
  const pY1 = useSpring(pY1Raw, smoothConfig);
  const pY2 = useSpring(pY2Raw, smoothConfig);
  const pY3 = useSpring(pY3Raw, smoothConfig);
  const priceYArr = [pY1, pY2, pY3];
  
  // Navbar scroll animation
  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarY = useTransform(scrollY, [0, 100], [24, 12]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [0.8, 1]);
  
  // About Parallax
  const { scrollYProgress: aProg } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aYTextRaw = useTransform(aProg, [0, 1], [80, -80]);
  const aYGridRaw = useTransform(aProg, [0, 1], [-100, 100]);
  const aYText = useSpring(aYTextRaw, smoothConfig);
  const aYGrid = useSpring(aYGridRaw, smoothConfig);

  // Cinematic shared variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 110 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 90, scale: 0.94 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        delay: 0.12 + i * 0.09, 
        duration: 0.95, 
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    })
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-hidden relative">
      {/* Enhanced Interactive Cursor */}
      <motion.div 
        className="fixed w-11 h-11 pointer-events-none z-[100] hidden lg:block mix-blend-difference"
        style={{ 
          left: cursorX, 
          top: cursorY,
          x: "-50%",
          y: "-50%"
        }}
      >
        <div className="w-full h-full border border-[var(--primary)]/80 rounded-full flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-[var(--primary)] rounded-full scale-75" />
        </div>
      </motion.div>

      {/* NAVBAR - Floating */}
      <motion.nav 
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
        style={{ 
          top: navbarY,
          scale: navbarScale
        }}
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-zinc-900/5 border border-zinc-200/50 px-6 h-16 flex items-center justify-between"
          style={{ opacity: navbarOpacity }}
        >
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-[var(--primary)]">
            Verixa
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-all hover:scale-105">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold px-5 py-2 text-zinc-600 hover:text-zinc-900 transition-colors">Log In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm font-semibold px-6 py-2.5 rounded-2xl shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/50 transition-all active:scale-[0.97]">
              Sign Up Free
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-700">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>

        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 border border-zinc-200/50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-6 space-y-4"
          >
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg text-zinc-600 hover:text-zinc-900">
                {link.label}
              </a>
            ))}
            <Link href="/auth/login" className="block py-3 text-lg">Log In</Link>
            <Link href="/auth/signup" className="btn-primary block text-center py-3.5 rounded-2xl">Sign Up Free</Link>
          </motion.div>
        )}
      </motion.nav>

      {/* HERO - Cinematic Staged Reveal + Scroll Parallax */}
      <section className="relative min-h-[100dvh] flex items-center pt-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[var(--primary)] opacity-[0.045]"
          style={{ y: bgY }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="flex-1 max-w-2xl"
              style={{ opacity: heroOpacity, scale: heroScale }}
            >
              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="text-6xl sm:text-7xl lg:text-[5.1rem] font-extrabold leading-[1.01] tracking-[-2.5px] mb-8"
              >
                Software Testing Made{' '}
                <TypingText />
              </motion.h1>

              {/* Subtext */}
              <motion.p 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 1 }}
                className="text-xl text-zinc-600 leading-relaxed mb-10 max-w-lg"
              >
                Verixa is the comprehensive UAT management platform where QA teams execute tests, track defects, and get formal sign-off—all in one place.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 1 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-3 text-lg font-semibold px-12 py-4.5 rounded-2xl shadow-2xl group">
                    Get Started 
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                  </Link>
                </motion.div>
                <motion.a 
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 text-lg font-semibold px-12 py-4.5 rounded-2xl border border-zinc-200 hover:border-[var(--primary)] hover:bg-zinc-50 transition-all"
                >
                  Explore Features
                </motion.a>
              </motion.div>

              {/* Trust signals */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15 }}
                className="flex items-center gap-8 text-sm text-zinc-500"
              >
                <span className="flex items-center gap-2"><Check className="text-emerald-500" size={18} /> Free trial</span>
                <span className="flex items-center gap-2"><Check className="text-emerald-500" size={18} /> No setup required</span>
                <span className="flex items-center gap-2"><Check className="text-emerald-500" size={18} /> Enterprise ready</span>
              </motion.div>
            </motion.div>

            {/* 3D Dashboard tracking cursor */}
            <motion.div 
              className="flex-1 max-w-lg w-full"
              initial={{ opacity: 0, y: 140 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number], delay: 0.6 }}
              style={{ perspective: 1800 }}
            >
              <motion.div 
                style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
                className="bg-white rounded-3xl border border-zinc-100 shadow-2xl shadow-[var(--primary)]/35 p-7 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-500 ml-3 font-medium">Verixa Dashboard</span>
                </div>
                
                <div className="bg-zinc-50 rounded-2xl p-6 space-y-6 border border-zinc-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-zinc-500">Welcome back</p>
                      <p className="text-2xl font-bold tracking-tight">QA Team 👋</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">QA</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[{ l: 'Test Cases', v: '245' }, { l: 'Executed', v: '198' }, { l: 'Pass Rate', v: '94%' }].map(s => (
                      <motion.div 
                        key={s.l} 
                        whileHover={{ y: -8, scale: 1.03 }}
                        className="bg-white rounded-2xl p-4 text-center border border-zinc-100 hover:border-[var(--primary)]/40"
                      >
                        <p className="text-3xl font-bold text-zinc-900">{s.v}</p>
                        <p className="text-xs text-zinc-500 mt-1">{s.l}</p>
                      </motion.div>
                    ))}
                  </div>

                  {[
                    { title: 'Mobile App v2.0', field: 'In Progress', color: '#4CAF50' },
                    { title: 'Payment Gateway', field: 'Ready for Sign-Off', color: '#FF5C8D' },
                  ].map((p, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 12 }}
                      className="bg-white rounded-2xl p-4 flex items-center justify-between border border-zinc-100 hover:border-[var(--primary)]/40 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.color + '15', color: p.color }}>
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-xs text-zinc-500">{p.field}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-zinc-400 group-hover:text-[var(--primary)] transition" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FIELD BADGES MARQUEE */}
      <section className="py-10 border-y border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Testing Across Every Platform</p>
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {[...FIELDS, ...FIELDS].map((f, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium border border-zinc-200 hover:border-[var(--primary)]/30 transition-all hover:scale-105"
                style={{ background: f.color + '10', color: f.color }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: f.color }} />
                {f.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {STATS.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.9 }}
              className="group"
            >
              <p className="text-5xl font-extrabold tracking-tighter text-zinc-900 group-hover:text-[var(--primary)] transition-colors">{s.value}</p>
              <p className="text-sm text-zinc-500 mt-3 tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featuresRef} className="py-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-3">PLATFORM FEATURES</p>
            <h2 className="text-5xl font-extrabold tracking-tight">Complete UAT management toolkit</h2>
            <p className="mt-4 text-zinc-600 text-lg">Everything your QA team needs to execute, track, and sign-off on quality.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div key={i} style={{ y: featYArr[i % 3] }} className="h-full">
                <motion.div 
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ 
                    y: -18, 
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 320, damping: 22 }
                  }}
                  className="group h-full bg-white border border-zinc-100 rounded-3xl p-9 hover:border-[var(--primary)]/30 transition-all"
                >
                  <motion.div 
                    whileHover={{ rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-8 group-hover:bg-[var(--primary)] group-hover:text-white transition-all"
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{f.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={stepsRef} className="py-28 px-6 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-3">HOW IT WORKS</p>
            <h2 className="text-5xl font-extrabold tracking-tight">From test plan to production in days</h2>
            <p className="mt-4 text-zinc-600 text-lg">Streamlined workflow for comprehensive UAT execution.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 90 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18, duration: 1 }}
                whileHover={{ y: -12 }}
                className="relative text-center group"
              >
                <motion.div style={{ y: sNumY }} className="absolute inset-0 flex items-center justify-center text-[10rem] font-extrabold text-[var(--primary)]/5 mb-6 group-hover:text-[var(--primary)]/15 transition-colors pointer-events-none -z-10">{s.number}</motion.div>
                <div className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{s.title}</h3>
                  <p className="text-zinc-600 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" ref={pricingRef} className="py-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-3">PRICING</p>
            <h2 className="text-5xl font-extrabold tracking-tight">Plans for every team size</h2>
            <p className="mt-4 text-zinc-600 text-lg">Start free. Scale as your testing needs grow.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div key={i} style={{ y: priceYArr[i % 3] }} className="h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 90 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.13 }}
                  whileHover={plan.highlighted ? { scale: 1.07, y: -14 } : { scale: 1.04, y: -10 }}
                  className={`group h-full rounded-3xl p-9 border transition-all duration-500 ${
                    plan.highlighted 
                      ? 'bg-zinc-900 text-white border-[var(--primary)] shadow-2xl shadow-[var(--primary)]/35' 
                      : 'bg-white border-zinc-100 hover:shadow-2xl hover:border-[var(--primary)]/30'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-[var(--primary)]'}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                    {plan.period && <span className={`text-sm ${plan.highlighted ? 'text-zinc-300' : 'text-zinc-500'}`}>{plan.period}</span>}
                  </div>
                  <p className={`mb-8 text-sm ${plan.highlighted ? 'text-zinc-300' : 'text-zinc-600'}`}>{plan.desc}</p>
                  
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm">
                        <Check size={18} className={plan.highlighted ? 'text-white mt-0.5' : 'text-[var(--primary)] mt-0.5'} />
                        <span className={plan.highlighted ? 'text-zinc-200' : 'text-zinc-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="/auth/signup" 
                    className={`block mt-auto text-center py-4 rounded-2xl text-sm font-semibold transition-all ${
                      plan.highlighted 
                        ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
                        : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={aboutRef} className="py-28 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            style={{ y: aYText }}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1"
          >
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-3">ABOUT VERIXA</p>
            <h2 className="text-5xl font-extrabold tracking-tight mb-8">Quality assurance, simplified</h2>
            
            <div className="space-y-6 text-zinc-600 leading-relaxed text-[17px]">
              <p>Verixa was built to solve a critical problem: QA teams spend too much time managing spreadsheets, emails, and scattered tools instead of focusing on quality. We created a unified platform where test planning, execution, defect tracking, and sign-off happen seamlessly in one place.</p>
              <p>Whether you're testing enterprise applications, mobile apps, APIs, or cloud services, Verixa provides the structure, visibility, and accountability your team needs. From small startups to Fortune 500 companies, teams trust Verixa to ensure their software meets quality standards before reaching production.</p>
            </div>

            <div className="mt-10">
              <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-3 text-base font-semibold px-8 py-4 rounded-2xl">
                Start Your Free Trial <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: aYGrid }}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1 max-w-md w-full"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Globe size={32} />, label: 'Global Scale', sub: 'Used by teams worldwide' },
                { icon: <Users size={32} />, label: 'Team Focused', sub: 'Built for QA collaboration' },
                { icon: <Zap size={32} />, label: 'Fast Execution', sub: 'Streamlined workflows' },
                { icon: <Shield size={32} />, label: 'Trusted', sub: 'Enterprise-grade security' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="bg-white rounded-3xl p-7 border border-zinc-100 hover:border-[var(--primary)]/30 transition-all"
                >
                  <div className="text-[var(--primary)] mb-5">{item.icon}</div>
                  <p className="font-bold mb-1">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl mx-auto text-center bg-zinc-900 rounded-3xl px-10 py-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--primary)] opacity-10" />
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 relative z-10">Ready to streamline your UAT process?</h2>
          <p className="text-zinc-300 text-lg mb-10 max-w-md mx-auto relative z-10">Join QA teams worldwide using Verixa to execute tests faster and ensure quality. Start your free trial today.</p>
          
          <motion.div whileHover={{ scale: 1.08 }}>
            <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-3 text-lg font-semibold px-12 py-5 rounded-2xl relative z-10">
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <p className="text-2xl font-extrabold text-[var(--primary)] mb-4">Verixa</p>
              <p className="text-sm text-zinc-500 leading-relaxed">Comprehensive UAT management platform. Verify acceptance with confidence.</p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How It Works', 'Documentation'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security'] },
            ].map((col, idx) => (
              <div key={idx}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-5 text-zinc-400">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Verixa. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['github', 'linkedin', 'x-twitter'].map(icon => (
                <a key={icon} href="#" className="hover:text-zinc-900 transition-colors">
                  <i className={`fa-brands fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary: #6C63FF;
        }
        
        .btn-primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 30px -8px rgba(108, 99, 255, 0.35);
        }
        
        .btn-primary:hover {
          background: #5851e6;
          box-shadow: 0 15px 35px -10px rgba(108, 99, 255, 0.45);
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 0.82s step-end infinite;
        }
      `}} />
    </div>
  );
}