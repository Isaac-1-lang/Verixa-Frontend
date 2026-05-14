"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Layers, Activity, Compass, Mail, LogOut, X, CheckSquare, AlertCircle
} from 'lucide-react';

const workspaceLinks = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { name: 'Projects', icon: <Layers size={18} />, path: '/dashboard/projects' },
  { name: 'Test Cases', icon: <Activity size={18} />, path: '/dashboard/test-cases' },
  { name: 'Test Runs', icon: <Compass size={18} />, path: '/dashboard/runs' },
  { name: 'Executions', icon: <Activity size={18} />, path: '/dashboard/executions' },
  { name: 'Defects', icon: <Mail size={18} />, path: '/dashboard/defects' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) onClose();
  }, [pathname]);

  const NavItem = ({ item }) => {
    const isActive = mounted && (pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path)));

    return (
      <Link
        href={item.path}
        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
        className={`group relative flex items-center gap-4 px-5 py-3 rounded-md font-bold text-sm transition-all ${isActive
          ? 'bg-navy text-white shadow-md shadow-navy/10'
          : 'text-navy/40 hover:text-navy hover:bg-navy/5'
          }`}
      >
        <div className={`transition-all ${isActive ? 'text-white' : 'text-navy/20 group-hover:text-navy'}`}>
          {item.icon}
        </div>
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        w-80 min-h-screen bg-white border-r border-navy/5 flex flex-col fixed left-0 top-0 z-50
        transform transition-transform duration-500 cubic-bezier(0.23, 1, 0.32, 1)
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 px-8 flex items-center justify-between border-b border-navy/5">
          <Link href="/dashboard" className="text-2xl font-bold text-navy tracking-tight">
            Verixa
          </Link>
          <button onClick={onClose} className="lg:hidden p-2.5 rounded-md hover:bg-navy/5 text-navy/40">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-10 overflow-y-auto py-10 custom-scrollbar">
          <div>
            <p className="px-5 text-xs font-bold text-navy/20 mb-6">Operations</p>
            <div className="space-y-2">
              {workspaceLinks.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-navy/5 flex flex-col gap-2">
          <Link href="/dashboard/profile" className="flex items-center gap-4 px-5 py-3 w-full text-navy/40 font-bold text-sm hover:text-navy hover:bg-navy/5 rounded-md transition-all group">
            <Activity size={18} className="text-navy/20 group-hover:text-navy transition-colors" />
            <span>Settings</span>
          </Link>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenType');
            window.location.href = '/auth/login';
          }} className="flex items-center gap-4 px-5 py-3 w-full text-navy/40 font-bold text-sm hover:text-navy hover:bg-navy/5 rounded-md transition-all group">
            <LogOut size={18} className="text-navy/20 group-hover:text-navy transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}