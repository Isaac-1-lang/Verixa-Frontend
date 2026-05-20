"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Layers, Users, TrendingUp, Shield,
  Zap, Globe, Check, Menu, X, BarChart3, BookOpen, Star
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
  { name: 'Starter', price: 'Free', period: 'Forever', desc: 'Perfect for small teams and pilot projects.', features: ['Up to 3 projects', 'Up to 50 test cases', 'Basic reporting', 'Email support', 'Community access'], cta: 'Get Started Free', highlighted: false },
  { name: 'Professional', price: '$99', period: 'Month', desc: 'For growing QA teams managing multiple projects.', features: ['Unlimited projects', 'Unlimited test cases', 'Advanced analytics', 'Defect tracking', 'Team collaboration', 'Priority support'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations with complex requirements.', features: ['Custom deployment', 'SSO & LDAP', 'Advanced security', 'API access', 'Custom integrations', 'Dedicated support'], cta: 'Contact Sales', highlighted: false },
];


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

  const { scrollYProgress: sProg } = useScroll({ target: stepsRef, offset: ["start end", "end start"] });
  const sNumYRaw = useTransform(sProg, [0, 1], [-120, 120]);
  const sNumY = useSpring(sNumYRaw, smoothConfig);

  const { scrollYProgress: pProg } = useScroll({ target: pricingRef, offset: ["start end", "end start"] });
  const pY1Raw = useTransform(pProg, [0, 1], [100, -100]);
  const pY2Raw = useTransform(pProg, [0, 1], [0, 0]);
  const pY3Raw = useTransform(pProg, [0, 1], [-100, 100]);
  const pY1 = useSpring(pY1Raw, smoothConfig);
  const pY2 = useSpring(pY2Raw, smoothConfig);
  const pY3 = useSpring(pY3Raw, smoothConfig);
  const priceYArr = [pY1, pY2, pY3];

  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarY = useTransform(scrollY, [0, 100], [24, 12]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [0.8, 1]);

  const { scrollYProgress: aProg } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aYTextRaw = useTransform(aProg, [0, 1], [80, -80]);
  const aYGridRaw = useTransform(aProg, [0, 1], [-100, 100]);
  const aYText = useSpring(aYTextRaw, smoothConfig);
  const aYGrid = useSpring(aYGridRaw, smoothConfig);

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
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 border border-white/40 rounded-full"
          />
          <div className="absolute w-1 h-1 bg-white rounded-full" />
        </div>
      </motion.div>

      <motion.nav
        className="fixed left-1/2 -translate-x-1/2 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-4"
        style={{
          top: navbarY,
          scale: navbarScale
        }}
      >
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 px-6 sm:px-8 h-[72px] flex items-center justify-between transition-all duration-500 relative"
          style={{ opacity: navbarOpacity }}
        >
          <Link href="/" className="relative z-10 text-[36px] font-extrabold tracking-tight text-navy flex items-center group">
            <img src="/logo.png" alt="Verixa Logo" className="h-[84px] w-auto group-hover:scale-105 transition-transform duration-300" />
            VERIXA
          </Link>

          <div className="hidden lg:flex items-center gap-10 relative z-10">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-[18px] font-semibold text-navy hover:text-navy transition-colors relative group py-2">
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-navy rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden relative z-10 p-2.5 rounded-full hover:bg-navy/5 text-navy transition-colors">
            {mobileMenuOpen ? <X size={22} className="stroke-[1.5]" /> : <Menu size={22} className="stroke-[1.5]" />}
          </button>
        </motion.div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden absolute top-full left-4 right-4 mt-4 border border-white/60 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-6 space-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] pointer-events-none rounded-3xl" />
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3.5 rounded-xl text-[15px] font-semibold text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors relative z-10">
                {link.label}
              </a>
            ))}
            <div className="w-full h-px bg-navy/5 my-4 relative z-10" />
            <Link href="/auth/login" className="block px-4 py-3.5 rounded-md text-[15px] font-semibold text-navy/70 hover:text-navy relative z-10 hover:bg-navy/5 transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="mt-2 bg-navy text-white flex justify-center py-4 rounded-md text-[15px] font-bold shadow-lg shadow-navy/20 relative z-10">Get Started Now</Link>
          </motion.div>
        )}
      </motion.nav>

      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
        {/* Subtle Decorative elements */}
        <div className="absolute inset-0 dot-grid opacity-[0.03]" />

        {/* Soft Background Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navy opacity-[0.03] rounded-full blur-[150px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy opacity-[0.02] rounded-full blur-[120px] -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              className="max-w-xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-navy leading-[1.1] mb-8"
              >
                The Standard for Quality Excellence.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-lg md:text-xl text-navy/60 leading-relaxed font-semibold mb-12"
              >
                Verixa is the unified platform where elite QA teams execute tests, track defects, and master the standard of modern UAT.
              </motion.p>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="flex flex-wrap items-center gap-10 mb-12"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, zIndex: 10 }}
                      className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-2xl shadow-navy/5 cursor-pointer transition-all bg-white"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 40}`}
                        alt="Expert User"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-navy flex items-center justify-center shadow-lg relative z-10 font-bold">
                    <span className="text-[11px] text-white">+5K</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-navy text-navy opacity-80" />
                    ))}
                    <span className="ml-2 text-sm font-bold text-navy/60">4.9/5 Rating</span>
                  </div>
                  <p className="text-[11px] font-bold text-navy/20">Trusted by Global QA Elite</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-wrap gap-6"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/auth/signup" className="bg-navy text-white inline-flex items-center gap-4 text-md font-bold px-8 py-4 rounded-md shadow-2xl shadow-navy/20 group transition-all">
                    Get Started Now
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                  </Link>
                </motion.div>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,38,74,0.02)' }}
                  className="inline-flex items-center gap-4 text-md font-bold px-8 py-4 rounded-md border border-navy/10 text-navy hover:border-navy/30 transition-all"
                >
                  Explore Features
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-md overflow-hidden shadow-[0_40px_80px_rgba(26,38,74,0.1)] border border-navy/5 group">
                <img
                  src="/image.png"
                  alt="Professional Collaboration"
                  className="w-full h-[420px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white/5 to-transparent pointer-events-none" />
              </div>

              <div className="absolute -inset-4 border border-navy/0.03 rounded-md pointer-events-none z-0" />
            </motion.div>
          </div>
        </div>
      </section>


      <section className="py-4 bg-navy overflow-hidden relative border-t-2 border-white group/marquee">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white via-navy to-navy" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-linear-to-r from-navy to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-linear-to-l from-navy to-transparent" />
        <div className="relative flex flex-col gap-3 md:gap-4 -rotate-1 lg:-rotate-2 scale-[1.01] mt-2 mb-2 transition-transform duration-3000 ease-out group-hover/marquee:scale-[1.02]">

          {/* Single Focused Marquee Row */}
          <div className="flex gap-4 animate-marquee-ltr whitespace-nowrap items-center w-max">
            {[...FIELDS, ...FIELDS, ...FIELDS].map((f, i) => (
              <span key={`r1-${i}`} className="inline-flex items-center gap-4 group/item cursor-pointer">
                <span className="text-base md:text-lg lg:text-xl font-black text-white group-hover/item:text-blue-400 uppercase tracking-tighter transition-colors select-none">
                  {f.name}
                </span>
                <span className="shrink-0 flex items-center justify-center">
                  <Star size={16} className="fill-white text-white opacity-40 rotate-15 group-hover/item:rotate-180 group-hover/item:fill-blue-400 group-hover/item:text-blue-400 group-hover/item:opacity-100 transition-all duration-700" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM BENTO ABOUT SECTION */}
      <section id="about" ref={aboutRef} className="py-16 px-6 bg-[#FAFBFF] overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div style={{ y: aYText }} className="text-center max-w-3xl mx-auto mb-20 relative z-10">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-navy tracking-tight leading-[1.05] mb-8">
              The Definitive Standard For <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 italic pr-4">Software Quality.</span>
              </span>
            </h2>
            <p className="text-xl text-navy/60 font-medium max-w-2xl mx-auto">
              Verixa converges real-time testing telemetry with formal governance, allowing elite engineering teams to deploy with absolute confidence.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div style={{ y: aYGrid }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

            {/* Main Hero Card - Spans 7 cols */}
            <div className="lg:col-span-7 bg-navy rounded-[2.5rem] p-10 md:p-14 text-white overflow-hidden relative group/hero flex flex-col justify-between min-h-[480px] shadow-[0_20px_60px_rgba(26,38,74,0.15)]">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover/hero:scale-110 group-hover/hero:opacity-[0.05] transition-all duration-1000" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                  Defense Grade <br /> Architecture.
                </h3>
                <p className="text-white/70 text-lg font-medium max-w-md leading-relaxed">
                  Engineered to eradicate friction. We replace fragmented tools with a singular, high-performance execution engine backed by cryptographic security.
                </p>
              </div>

              <div className="mt-12 flex items-center gap-5 relative z-10 bg-white/5 p-4 pr-8 rounded-2xl w-max backdrop-blur-md border border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 60}&backgroundColor=ffffff`} alt="Team" className="w-12 h-12 rounded-full border-2 border-navy object-cover shadow-lg" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-lg text-white">Built by Experts</p>
                  <p className="text-white/60 font-semibold text-xs tracking-wider uppercase mt-0.5">For Global Teams</p>
                </div>
              </div>
            </div>

            {/* Right side stack - Spans 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Top Right Card */}
              <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-navy/[0.04] shadow-[0_20px_40px_rgba(26,38,74,0.03)] flex-1 group/card hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_40px_80px_rgba(26,38,74,0.08)]">
                <h3 className="text-3xl font-black text-navy mb-4 tracking-tight">Global Scale</h3>
                <p className="text-navy/60 font-medium text-lg leading-relaxed">
                  Operates seamlessly across distributed nodes with zero configuration drift. Operates seamlessly across distributed nodes with zero configuration drift. Operates seamlessly across distributed nodes with zero configuration drift.
                </p>
              </div>

              {/* Bottom Right Split */}
              <div className="grid grid-cols-2 gap-6 flex-1">
                <div className="bg-white rounded-[2rem] p-8 border border-navy/[0.04] shadow-[0_20px_40px_rgba(26,38,74,0.03)] group/min hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center items-center text-center hover:shadow-[0_40px_80px_rgba(26,38,74,0.08)]">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-5 group-hover/min:scale-110 transition-transform duration-500">
                    <Zap className="text-navy w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2 tracking-tight">Zero Latency</h3>
                  <p className="text-navy/50 text-sm font-semibold">Immediate telemetry.</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-navy/[0.04] shadow-[0_20px_40px_rgba(26,38,74,0.03)] group/min hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center items-center text-center hover:shadow-[0_40px_80px_rgba(26,38,74,0.08)]">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-5 group-hover/min:scale-110 transition-transform duration-500">
                    <Users className="text-navy w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2 tracking-tight">Elite Teams</h3>
                  <p className="text-navy/50 text-sm font-semibold">For heavy QA pipelines.</p>
                </div>
              </div>

            </div>

          </motion.div>
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
            <h2 className="text-6xl font-bold text-navy mb-2">Professional Toolkit</h2>
            <p className="text-navy/60 text-lg font-medium">Engineered for teams that demand absolute quality control and professional-grade performance.</p>
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
                  className="group h-full bg-offwhite border border-navy/5 rounded-2xl p-8 hover:border-navy/10 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center mb-10 shadow-2xl shadow-navy/20"
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
            <h2 className="text-6xl font-bold text-white mb-2">Execution Flow</h2>
            <p className="text-white/40 text-xl font-normal">A systematic approach to quality assurance, engineered for absolute efficiency.</p>
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
            <h2 className="text-6xl font-bold text-navy mb-2">Pricing Plans</h2>
            <p className="text-navy/60 text-xl font-normal">Clear, transparent investment options for organizations focused on excellence.</p>
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
                  className={`group h-full rounded-md p-6 border transition-all duration-500 flex flex-col ${plan.highlighted
                    ? 'bg-navy text-white border-navy shadow-[0_32px_64px_rgba(26,38,74,0.16)]'
                    : 'bg-offwhite border-navy/5 hover:border-navy/10'
                    }`}
                >
                  <p className={`text-lg font-bold mb-4 uppercase ${plan.highlighted ? 'text-white/60' : 'text-navy/40'}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-6xl font-bold leading-none">{plan.price}</span>
                    {plan.period && <span className={`text-md font-semibold ${plan.highlighted ? 'text-white/80' : 'text-navy/60'}`}>/ {plan.period}</span>}
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
                    className={`block w-full text-center py-4 rounded-md text-base font-bold transition-all ${plan.highlighted
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

      {/* CTA BANNER */}
      <section className="py-16 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-[3rem] px-8 sm:px-16 md:px-24 py-32 text-center overflow-hidden shadow-[0_40px_80px_rgba(26,38,74,0.15)] group"
          >
            {/* Background Image Setup */}
            <div className="absolute inset-0 z-0">
              <img
                src="/image.png"
                alt="Verixa Software"
                className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-navy/40" />
              <div className="absolute inset-0 bg-linear-to-t from-navy/60 via-transparent to-navy/30" />
            </div>

            <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] pointer-events-none z-10" />
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.15] tracking-tight">
                Ready to ensure quality?
              </h2>
              <p className="text-white text-md md:text-xl mb-14 font-normal leading-relaxed opacity-90 max-w-3xl mx-auto">
                Join the thousands of elite organizations using Verixa to eliminate uncertainty, streamline testing, and drive excellence across every deployment.
              </p>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link href="/auth/signup" className="group/btn bg-white text-navy inline-flex items-center gap-4 text-xl font-bold px-6 py-4 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500">
                  Get Started For Free
                  <span className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center group-hover/btn:bg-navy/10 transition-colors duration-300">
                    <ArrowRight size={20} className="text-navy group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1224] border-t border-white/5 pt-16 pb-8 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center">
                {/* Ensure logo works on dark background */}
                <img src="/logo.png" alt="Verixa Logo" className="h-16 w-auto brightness-0 invert" />
                <span className="text-4xl font-extrabold tracking-tight text-white">Verixa</span>
              </Link>
              <p className="text-base text-white/50 font-normal leading-relaxed mt-2">
                High-performance UAT management platform. Absolute confidence in every deployment.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Projects', 'Test Cases', 'Runs'] },
              { title: 'Resources', links: ['Executions', 'Defects', 'Metrics'] },
              { title: 'Support', links: ['Directives', 'Terms', 'Privacy'] },
            ].map((col, idx) => (
              <div key={idx}>
                <p className="text-xs font-bold text-white/30 mb-8 tracking-[0.25em]">{col.title.toUpperCase()}</p>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm font-medium text-white/60 hover:text-white transition-all hover:translate-x-1 inline-block">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-medium text-white/40">
            <p>© {new Date().getFullYear()} Verixa Engineering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}