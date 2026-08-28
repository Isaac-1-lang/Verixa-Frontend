"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Layers, Compass, LogOut, X,
  Settings, ChevronRight, Zap, BarChart3, AlertCircle, CheckSquare,
  Building2, Users, MessageSquareText, GraduationCap, BrainCircuit,
  CreditCard, Rocket, ShieldCheck, ListTodo, FileBarChart
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Organizations', icon: Building2, path: '/dashboard/organizations' },
  { name: 'People & Access', icon: Users, path: '/dashboard/access' },
  { name: 'Projects', icon: Layers, path: '/dashboard/projects' },
  { name: 'Test Cases', icon: Zap, path: '/dashboard/test-cases' },
  { name: 'Requirements', icon: CheckSquare, path: '/dashboard/requirements' },
  { name: 'Test Runs', icon: Compass, path: '/dashboard/runs' },
  { name: 'Execution Queue', icon: ListTodo, path: '/dashboard/queue' },
  { name: 'Executions', icon: BarChart3, path: '/dashboard/executions' },
  { name: 'Defects', icon: AlertCircle, path: '/dashboard/defects' },
  { name: 'Feedback', icon: MessageSquareText, path: '/dashboard/feedback' },
  { name: 'Training', icon: GraduationCap, path: '/dashboard/training' },
  { name: 'Competencies', icon: BrainCircuit, path: '/dashboard/competencies' },
  { name: 'Go-live Readiness', icon: Rocket, path: '/dashboard/readiness' },
  { name: 'Reports', icon: FileBarChart, path: '/dashboard/reports' },
  { name: 'Plans & Billing', icon: CreditCard, path: '/dashboard/billing' },
  { name: 'Administration', icon: ShieldCheck, path: '/dashboard/admin' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) onClose();
  }, [pathname]);

  const isActive = (item) =>
    mounted && (pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path)));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`
        w-60 min-h-screen bg-white flex flex-col fixed left-0 top-0 z-50
        border-r border-navy/0.06
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        style={{ boxShadow: '4px 0 24px rgba(26,38,74,0.04)' }}
      >
        {/* ── Logo ── */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-navy/6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shadow-sm shadow-navy/20 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Verixa" className="w-10 h-10 object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-navy text-lg tracking-tight">VERIXA</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-navy/5 text-navy/30 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) onClose(); }}
                  className={`group relative flex items-center gap-3 px-2 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${active
                      ? 'bg-navy text-white shadow-md shadow-navy/20'
                      : 'text-navy/50 hover:text-navy hover:bg-navy/5'
                    }`}
                >
                  {/* Active left accent */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/50 rounded-full -ml-4"
                    />
                  )}

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${active
                      ? 'bg-white/15'
                      : 'bg-navy/4 group-hover:bg-navy/8'
                    }`}>
                    <Icon size={13} className={active ? 'text-white' : 'text-navy/40 group-hover:text-navy'} />
                  </div>

                  <span className="flex-1">{item.name}</span>

                  {active && (
                    <ChevronRight size={12} className="text-white/50 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Bottom actions ── */}
        <div className="p-3 border-t border-navy/6 space-y-0.5 shrink-0">
          <Link
            href="/dashboard/profile"
            className="group flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm text-navy/50 hover:text-navy hover:bg-navy/5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-navy/4 group-hover:bg-navy/8 flex items-center justify-center transition-colors">
              <Settings size={13} className="text-navy/40 group-hover:text-navy" />
            </div>
            Settings
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('tokenType');
              localStorage.removeItem('user');
              window.location.href = '/auth/login';
            }}
            className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm text-navy/50 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-navy/4 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <LogOut size={13} className="text-navy/40 group-hover:text-red-500" />
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
