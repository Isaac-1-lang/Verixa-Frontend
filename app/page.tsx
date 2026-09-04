"use client";
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Layers, Users, TrendingUp, Shield,
  Zap, Menu, X, BarChart3, BookOpen
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
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

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-navy overflow-hidden relative">
      <nav className="fixed left-1/2 -translate-x-1/2 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-full shadow-lg border border-white/60 px-6 sm:px-8 h-[72px] flex items-center justify-between">
          <Link href="/" className="relative z-10 text-[36px] font-extrabold tracking-tight text-navy flex items-center group">
            <img src="/logo.png" alt="Verixa Logo" className="h-[84px] w-auto group-hover:scale-105 transition-transform duration-300" />
            VERIXA
          </Link>

          <div className="hidden lg:flex items-center gap-8 relative z-10">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-[18px] font-semibold text-navy hover:text-navy/70 transition-colors relative group py-2">
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-navy rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <div className="flex items-center gap-6 ml-2 pl-8 border-l border-navy/10">
              <Link href="/auth/login" className="text-[16px] font-bold text-navy hover:text-navy/70 transition-colors mt-3.5">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-navy text-white px-6 py-2.5 rounded-full font-bold text-[15px] hover:scale-105 transition-transform shadow-lg">
                Get Started
              </Link>
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden relative z-10 p-2.5 rounded-full hover:bg-navy/5 text-navy transition-colors">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-4 border border-white/60 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl p-6 space-y-1">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3.5 rounded-xl text-[15px] font-semibold text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors">
                {link.label}
              </a>
            ))}
            <div className="w-full h-px bg-navy/5 my-4" />
            <Link href="/auth/login" className="block px-4 py-3.5 rounded-md text-[15px] font-semibold text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="mt-2 bg-navy text-white flex justify-center py-4 rounded-md text-[15px] font-bold shadow-lg">Get Started Now</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 dot-grid opacity-[0.03]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-7xl font-bold text-navy leading-[1.1] mb-8">
                The Standard for Quality Excellence.
              </h1>

              <p className="text-lg md:text-xl text-navy/60 leading-relaxed font-semibold mb-12">
                Verixa is the unified platform where elite QA teams execute tests, track defects, and master the standard of modern UAT.
              </p>

              <div className="flex flex-wrap items-center gap-10 mb-12">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 40}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-navy flex items-center justify-center shadow-lg font-bold">
                    <span className="text-[11px] text-white">QA</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Shield size={15} className="text-navy opacity-80" aria-hidden="true" />
                    <span className="ml-2 text-sm font-bold text-navy/60">Built for quality teams</span>
                  </div>
                  <p className="text-[11px] font-bold text-navy/20">UAT, evidence, defects, and sign-off</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <Link href="/auth/signup" className="bg-navy text-white inline-flex items-center gap-4 text-md font-bold px-8 py-4 rounded-md shadow-lg hover:scale-105 transition-transform">
                  Get Started Now
                  <ArrowRight size={18} />
                </Link>
                <a href="#features" className="inline-flex items-center gap-4 text-md font-bold px-8 py-4 rounded-md border border-navy/10 text-navy hover:border-navy/30 hover:bg-navy/5 transition-all">
                  Explore Features
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-md overflow-hidden shadow-2xl border border-navy/5">
                <img src="/landing-team.jpg" alt="Verixa team collaborating" className="w-full h-[420px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-[#FAFBFF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight leading-[1.05] mb-8">
              The Definitive Standard For <br />
              <span className="relative inline-block mt-2 italic">Software Quality.</span>
            </h2>
            <p className="text-xl text-navy/60 font-medium max-w-2xl mx-auto">
              Verixa converges real-time testing telemetry with formal governance, allowing elite engineering teams to deploy with absolute confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-navy rounded-3xl p-10 md:p-14 text-white flex flex-col justify-between min-h-[480px] shadow-lg">
              <div>
                <h3 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-6">
                  Defense Grade <br /> Architecture.
                </h3>
                <p className="text-white/70 text-lg font-medium max-w-md leading-relaxed">
                  Engineered to eradicate friction. We replace fragmented tools with a singular, high-performance execution engine backed by cryptographic security.
                </p>
              </div>

              <div className="mt-12 flex items-center gap-5 bg-white/5 p-4 pr-8 rounded-2xl w-max backdrop-blur-md border border-white/10">
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

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-10 lg:p-12 border border-navy/5 shadow-md flex-1">
                <h3 className="text-3xl font-black text-navy mb-4 tracking-tight">Global Scale</h3>
                <p className="text-navy/60 font-medium text-lg leading-relaxed">
                  Operates seamlessly across distributed nodes with zero configuration drift.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 flex-1">
                <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-md flex flex-col justify-center items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-5">
                    <Zap className="text-navy w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2 tracking-tight">Zero Latency</h3>
                  <p className="text-navy/50 text-sm font-semibold">Immediate telemetry.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-md flex flex-col justify-center items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-5">
                    <Users className="text-navy w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2 tracking-tight">Elite Teams</h3>
                  <p className="text-navy/50 text-sm font-semibold">For heavy QA pipelines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-6xl font-bold text-navy mb-2">Professional Toolkit</h2>
            <p className="text-navy/60 text-lg font-medium">Engineered for teams that demand absolute quality control and professional-grade performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => (
              <div key={i} className="h-full bg-offwhite border border-navy/5 rounded-2xl p-8 hover:border-navy/10 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center mb-10 shadow-lg">
                  {f.icon}
                </div>
                <h3 className="text-3xl font-bold text-navy mb-6">{f.title}</h3>
                <p className="text-navy/40 text-lg leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-28">
            <h2 className="text-6xl font-bold text-white mb-2">Execution Flow</h2>
            <p className="text-white/40 text-xl font-normal">A systematic approach to quality assurance, engineered for absolute efficiency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="relative mb-10 z-10">
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <span className="text-2xl font-black text-white">{s.number}</span>
                  </div>
                </div>

                <div className="w-full bg-white/5 border border-white/10 rounded-md p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                  <p className="text-white/40 text-base leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl px-8 sm:px-16 md:px-24 py-32 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0">
              <img src="/image.png" alt="Verixa Software" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy/80" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.15] tracking-tight">
                Ready to ensure quality?
              </h2>
              <p className="text-white text-md md:text-xl mb-14 font-normal leading-relaxed opacity-90 max-w-3xl mx-auto">
                Bring testing, evidence, defect resolution, and approval into one workflow so your team can make confident release decisions.
              </p>

              <Link href="/auth/signup" className="bg-white text-navy inline-flex items-center gap-4 text-xl font-bold px-6 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                Get Started For Free
                <span className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                  <ArrowRight size={20} className="text-navy" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1224] border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center">
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
                      <a href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
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
