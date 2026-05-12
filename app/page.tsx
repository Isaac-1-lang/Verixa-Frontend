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
  { name: 'Software Testing', color: '#FFFFFF' },
  { name: 'Quality Assurance', color: '#FFFFFF' },
  { name: 'DevOps', color: '#FFFFFF' },
  { name: 'Enterprise Apps', color: '#FFFFFF' },
  { name: 'Mobile Apps', color: '#FFFFFF' },
  { name: 'Web Applications', color: '#FFFFFF' },
  { name: 'Cloud Services', color: '#FFFFFF' },
  { name: 'API Testing', color: '#FFFFFF' },
  { name: 'Performance Testing', color: '#FFFFFF' },
  { name: 'Security Testing', color: '#FFFFFF' },
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
    <span className="text-white relative inline-block font-black">
      {displayText}
      <span className="animate-blink absolute -right-2 top-1/2 -translate-y-1/2 w-[6px] h-[80%] bg-white rounded-md" />
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
    <div className="min-h-screen bg-white text-navy overflow-hidden relative">
      <motion.div
        className="fixed pointer-events-none z-100 hidden lg:block mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%"
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 border border-white/40 rounded-full"
          />
          {/* Inner Dot */}
          <div className="absolute w-1 h-1 bg-white rounded-full" />
        </div>
      </motion.div>

      <motion.nav
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
        style={{
          top: navbarY,
          scale: navbarScale
        }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-2xl rounded-md shadow-xl shadow-navy/5 border border-navy/5 px-8 h-20 flex items-center justify-between"
          style={{ opacity: navbarOpacity }}
        >
          <Link href="/" className="text-3xl font-bold tracking-tight text-navy">
            Verixa
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-md font-bold text-navy/40 hover:text-navy transition-all hover:-translate-y-px">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold px-6 py-2 text-navy/40 hover:text-navy transition-colors">Log In</Link>
            <Link href="/auth/signup" className="bg-white text-navy text-sm font-black px-8 py-3 rounded-md shadow-xl shadow-white/10 hover:shadow-white/20 transition-all active:scale-[0.95] hover:-translate-y-px">
              Get Started
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-navy">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 border border-navy/5 bg-white/95 backdrop-blur-2xl rounded-md shadow-2xl p-8 space-y-6"
          >
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-xl font-bold text-navy/40 hover:text-navy">
                {link.label}
              </a>
            ))}
            <Link href="/auth/login" className="block py-3 text-xl font-bold">Log In</Link>
            <Link href="/auth/signup" className="bg-navy text-white block text-center py-4 rounded-md font-bold">Get Started</Link>
          </motion.div>
        )}
      </motion.nav>

      <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 dot-grid opacity-5"
          style={{ y: bgY }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              className="flex-1 max-w-3xl"
              style={{ opacity: heroOpacity, scale: heroScale }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="text-5xl md:text-7xl font-bold text-navy leading-[1.1] mb-8"
              >
                The Standard for Professional UAT Mastery.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-lg text-navy/40 leading-relaxed max-w-2xl mb-12 font-medium"
              >
                Verixa is the premium UAT management platform where QA teams execute tests, track defects, and get formal sign-off with absolute precision.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-wrap gap-6 mb-16"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/auth/signup" className="bg-navy text-white inline-flex items-center gap-4 text-xl font-bold px-12 py-5 rounded-md shadow-xl shadow-navy/10 group transition-all">
                    Get Started
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                  </Link>
                </motion.div>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,38,74,0.02)' }}
                  className="inline-flex items-center gap-4 text-xl font-bold px-12 py-5 rounded-md border border-navy/10 text-navy hover:border-navy/30 transition-all"
                >
                  Explore Features
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[500px] h-[300px] opacity-10 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-[400px] h-[300px] opacity-10 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-10"
          style={{ background: 'linear-gradient(to right, #1A264A 0%, transparent 100%)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-10"
          style={{ background: 'linear-gradient(to left, #1A264A 0%, transparent 100%)' }} />

        {/* Row 1 — left to right */}
        <div className="flex gap-5 mb-4 animate-marquee-ltr whitespace-nowrap">
          {[...FIELDS, ...FIELDS, ...FIELDS].map((f, i) => (
            <span
              key={`r1-${i}`}
              className="cursor-pointer inline-flex items-center gap-3 px-7 py-3.5 rounded-md text-sm font-bold border border-white/10 bg-white/6 text-white/70 hover:bg-white/12 hover:border-white/20 hover:text-white hover:scale-105 transition-all duration-300 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <span className="w-2 h-2 rounded-full bg-white opacity-30" />
              {f.name}
            </span>
          ))}
        </div>

        {/* Row 2 — right to left */}
        <div className="flex gap-5 animate-marquee-rtl whitespace-nowrap">
          {[...FIELDS.slice(5), ...FIELDS, ...FIELDS.slice(0, 5), ...FIELDS].map((f, i) => (
            <span
              key={`r2-${i}`}
              className="cursor-pointer inline-flex items-center gap-3 px-7 py-3.5 rounded-md text-sm font-bold border border-white/10 bg-white/6 text-white/70 hover:bg-white/12 hover:border-white/20 hover:text-white hover:scale-105 transition-all duration-300 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <span className="w-2 h-2 rounded-full bg-white opacity-20" />
              {f.name}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className="group"
            >
              <p className="text-6xl font-bold text-navy group-hover:scale-105 transition-transform duration-500">{s.value}</p>
              <p className="text-md text-navy/40 font-semibold mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featuresRef} className="py-16 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-6xl font-bold text-navy mb-8">Professional Toolkit</h2>
            <p className="text-navy/60 text-xl font-medium">Engineered for teams that demand absolute quality control and professional-grade performance.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => (
              <motion.div key={i} style={{ y: featYArr[i % 3] }} className="h-full">
                <motion.div
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    y: -10,
                    backgroundColor: 'rgba(26,38,74,0.02)',
                    transition: { type: "spring", stiffness: 300, damping: 25 }
                  }}
                  className="group h-full bg-offwhite border border-navy/5 rounded-md p-12 hover:border-navy/10 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-md bg-navy text-white flex items-center justify-center mb-10 shadow-2xl shadow-navy/20"
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="text-3xl font-bold text-navy mb-6">{f.title}</h3>
                  <p className="text-navy/40 text-lg leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={stepsRef} className="py-24 px-6 bg-navy overflow-hidden relative">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial ambient glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-28"
          >
            <h2 className="text-6xl font-bold text-white mb-8">Execution Flow</h2>
            <p className="text-white/40 text-xl font-medium">A systematic approach to quality assurance, engineered for absolute efficiency.</p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              className="hidden md:block absolute top-18 left-[16.6%] right-[16.6%] h-px bg-white/10 origin-left"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 70 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.18, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Ghost number — parallax */}
                  <motion.div
                    style={{ y: sNumY }}
                    className="absolute -top-8 text-[11rem] font-bold text-white/0.03 pointer-events-none select-none leading-none"
                  >
                    {s.number}
                  </motion.div>

                  {/* Orb */}
                  <div className="relative mb-10 z-10">
                    {/* Pulse ring */}
                    <motion.div
                      animate={{ scale: [1, 1.45, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                      className="absolute inset-0 rounded-full border border-white/20"
                    />
                    {/* Outer ring */}
                    <div className="absolute -inset-3 rounded-full border border-white/10" />
                    {/* Main orb */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(255,255,255,0.07)] group-hover:bg-white/15 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-500"
                    >
                      <span className="text-2xl font-black text-white">{s.number}</span>
                    </motion.div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.07)' }}
                    className="w-full bg-white/0.04 border border-white/0.08 rounded-md p-10 transition-all duration-500 group-hover:border-white/20"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                    <p className="text-white/40 text-base leading-relaxed font-medium">{s.desc}</p>

                    {/* Bottom accent line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      className="mt-8 h-px bg-white/10 origin-left"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" ref={pricingRef} className="py-24 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-6xl font-bold text-navy mb-4">Scaling Logic</h2>
            <p className="text-navy/60 text-xl font-medium">Clear, transparent investment options for organizations focused on excellence.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div key={i} style={{ y: priceYArr[i % 3] }} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{
                    y: -10,
                    backgroundColor: plan.highlighted ? '#1A264A' : 'rgba(26,38,74,0.02)',
                    transition: { duration: 0.4 }
                  }}
                  className={`group h-full rounded-md p-12 border transition-all duration-500 flex flex-col ${plan.highlighted
                    ? 'bg-navy text-white border-navy shadow-[0_32px_64px_rgba(26,38,74,0.16)]'
                    : 'bg-offwhite border-navy/5 hover:border-navy/10'
                    }`}
                >
                  <p className={`text-xs font-bold mb-8 ${plan.highlighted ? 'text-white/60' : 'text-navy/40'}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-6xl font-bold leading-none">{plan.price}</span>
                    {plan.period && <span className={`text-sm font-bold ${plan.highlighted ? 'text-white/40' : 'text-navy/20'}`}>{plan.period.replace('/', '')}</span>}
                  </div>
                  <p className={`mb-12 text-lg font-medium leading-relaxed ${plan.highlighted ? 'text-white/80' : 'text-navy/60'}`}>{plan.desc}</p>

                  <ul className="space-y-6 mb-16 grow">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-4 text-sm font-bold">
                        <div className={`mt-1 w-4 h-4 rounded-md flex items-center justify-center border ${plan.highlighted ? 'border-white/20' : 'border-navy/20'}`}>
                          <Check size={10} className={plan.highlighted ? 'text-white' : 'text-navy'} />
                        </div>
                        <span className={plan.highlighted ? 'text-white' : 'text-navy'}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/signup"
                    className={`block w-full text-center py-5 rounded-md text-base font-bold transition-all ${plan.highlighted
                      ? 'bg-white text-navy hover:scale-[1.02]'
                      : 'bg-navy text-white hover:scale-[1.02]'
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
      <section id="about" ref={aboutRef} className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
          <motion.div
            style={{ y: aYText }}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1"
          >
            <h2 className="text-6xl font-bold text-navy mb-12">Quality Simplified</h2>

            <div className="space-y-8 text-navy/60 leading-relaxed text-xl font-medium">
              <p>Verixa was engineered to solve a critical systemic failure: QA teams spend 70% of their operational cycles managing architectural debt, scattered evidence, and opaque reporting.</p>
              <p>We've created a unified high-performance environment where test strategy, execution telemetry, and formal governance converge. From agile disruptors to global enterprises, Verixa is the gold standard for quality authority.</p>
            </div>

            <div className="mt-16">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link href="/auth/signup" className="bg-navy text-white inline-flex items-center gap-4 text-lg font-bold px-12 py-5 rounded-md shadow-xl shadow-navy/10">
                  Secure Your Access <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: aYGrid }}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1 max-w-xl w-full"
          >
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: <Globe size={40} />, label: 'Global Scale', sub: 'Deployed Worldwide' },
                { icon: <Users size={40} />, label: 'Elite Teams', sub: 'Designed for Experts' },
                { icon: <Zap size={40} />, label: 'Zero Latency', sub: 'Optimized Workflows' },
                { icon: <Shield size={40} />, label: 'Secure Vault', sub: 'Enterprise Integrity' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, backgroundColor: 'rgba(26,38,74,0.02)' }}
                  className="bg-offwhite rounded-md p-10 border border-navy/5 transition-all duration-500"
                >
                  <div className="text-navy mb-8 opacity-40">{item.icon}</div>
                  <p className="font-bold text-lg text-navy mb-2">{item.label}</p>
                  <p className="text-sm text-navy/40 font-medium">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto text-center bg-offwhite rounded-md px-10 py-16 border border-navy/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-grid opacity-20" />

          <h2 className="text-6xl sm:text-7xl font-bold text-navy mb-4 relative z-10 leading-tight">Ready to secure your quality gates?</h2>
          <p className="text-navy/40 text-xl mb-8 max-w-2xl mx-auto relative z-10 font-medium">Join the thousands of teams using Verixa to eliminate uncertainty and drive excellence.</p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/signup" className="bg-navy text-white inline-flex items-center gap-3 text-lg font-bold px-10 py-5 rounded-md relative z-10 shadow-2xl shadow-navy/20">
              Get Started <ArrowRight size={28} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-navy/5 py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 mb-16">
            <div className="col-span-2 md:col-span-1">
              <span className="text-4xl font-bold text-navy">Verixa</span>
              <p className="text-base text-navy/30 font-bold leading-relaxed mt-4">High-performance UAT management platform. Absolute confidence in every deployment.</p>
            </div>

            {[
              { title: 'Platform', links: ['Projects', 'Test Cases', 'Runs'] },
              { title: 'Resources', links: ['Executions', 'Defects', 'Metrics'] },
              { title: 'Support', links: ['Directives', 'Terms', 'Privacy'] },
            ].map((col, idx) => (
              <div key={idx}>
                <p className="text-xs font-bold text-navy/20 mb-6 tracking-[0.2em]">{col.title.toUpperCase()}</p>
                <ul className="space-y-6">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-base font-bold text-navy/40 hover:text-navy transition-all hover:translate-x-1 inline-block">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-navy/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-12 text-sm font-bold text-navy/20">
            <p>© {new Date().getFullYear()} Verixa Engineering. All rights reserved.</p>
            <div className="flex items-center gap-12">
              {['github', 'linkedin', 'twitter'].map(icon => (
                <a key={icon} href="#" className="hover:text-navy transition-all hover:scale-110">
                  <i className={`fa-brands fa-${icon} text-xl`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}