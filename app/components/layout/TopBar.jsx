"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Menu, Settings, LogOut, User, X } from 'lucide-react';

export default function TopBar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = [
    { id: 1, title: 'New test run assigned', body: 'Sarah assigned you to Run #42 — Login Flow.', isRead: false, time: '2m ago' },
    { id: 2, title: 'Defect resolved', body: 'DEF-119 has been marked as resolved.', isRead: false, time: '14m ago' },
    { id: 3, title: 'System maintenance', body: 'Scheduled tonight at 12:00 AM UTC.', isRead: true, time: '1h ago' },
  ];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) { try { setUser(JSON.parse(userStr)); } catch (e) { } }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.fullName || user.username || 'User'
    : 'User';
  const initials = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarUrl = user?.profilePicture || user?.profileImageUrl || null;
  const email = user?.email || '';

  return (
    <header className="h-[72px] bg-white border-b border-navy/[0.06] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40"
      style={{ boxShadow: '0 1px 12px rgba(26,38,74,0.04)' }}
    >
      {/* Left — Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl hover:bg-navy/5 flex items-center justify-center text-navy/40 hover:text-navy transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className={`ml-4 relative hidden md:flex items-center max-w-[400px] flex-1 transition-all duration-300`}>
          <div className="absolute left-3.5 text-navy/30 pointer-events-none">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search projects, tests, defects..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-9 pr-4 py-2.5 text-[15px] font-medium rounded-md border transition-all duration-200 outline-none
              ${searchFocused
                ? 'border-navy/20 bg-white shadow-sm shadow-navy/5 text-navy placeholder-navy/30'
                : 'border-navy/8 bg-navy/2 text-navy/60 placeholder-navy/20 hover:border-navy/15'
              }`}
          />
          {searchFocused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-navy/20 border border-navy/10 rounded px-1.5 py-0.5">
              ⌘K
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        <button className="md:hidden w-9 h-9 rounded-xl hover:bg-navy/5 flex items-center justify-center text-navy/40 transition-all">
          <Search size={18} />
        </button>
      </div>

      {/* Right — Bell + Profile */}
      <div className="flex items-center gap-2 ml-4">

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setIsNotificationsOpen(v => !v); setIsProfileOpen(false); }}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isNotificationsOpen ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy hover:bg-navy/5'
              }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full border border-white" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[360px] bg-white border border-navy/[0.08] rounded-2xl shadow-2xl shadow-navy/10 z-50 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-navy/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold text-navy">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-navy text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
                    )}
                  </div>
                  <button className="text-[11px] font-bold text-navy/40 hover:text-navy transition-colors">Mark all read</button>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-5 py-3.5 border-b border-navy/[0.04] last:border-0 cursor-pointer transition-colors flex gap-3 ${!n.isRead ? 'bg-navy/[0.025] hover:bg-navy/[0.04]' : 'hover:bg-navy/[0.02]'
                        }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-navy' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] font-semibold leading-tight mb-0.5 ${!n.isRead ? 'text-navy' : 'text-navy/60'}`}>{n.title}</p>
                        <p className="text-[11.5px] text-navy/40 leading-relaxed">{n.body}</p>
                        <p className="text-[10px] font-bold text-navy/25 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-navy/5 bg-navy/[0.01]">
                  <Link href="/dashboard/notifications" onClick={() => setIsNotificationsOpen(false)}
                    className="text-[11.5px] font-bold text-navy/40 hover:text-navy transition-colors block text-center">
                    View all notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-navy/[0.08] mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setIsProfileOpen(v => !v); setIsNotificationsOpen(false); }}
            className={`flex items-center gap-2.5 py-1.5 px-2 rounded-xl transition-all ${isProfileOpen ? 'bg-navy/5' : 'hover:bg-navy/[0.04]'
              }`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-navy flex items-center justify-center shadow-sm shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[11px] font-black">{initials}</span>
              )}
            </div>
            <div className="hidden sm:block text-left max-w-[100px]">
              <p className="text-[12.5px] font-bold text-navy leading-tight truncate">{fullName}</p>
              <p className="text-[10.5px] text-navy/35 font-medium truncate">{email || 'Verixa User'}</p>
            </div>
            <ChevronDown
              size={13}
              className={`text-navy/30 hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[220px] bg-white border border-navy/[0.08] rounded-2xl shadow-2xl shadow-navy/10 z-50 overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3.5 border-b border-navy/5 bg-navy/[0.01]">
                  <p className="text-[13px] font-bold text-navy truncate">{fullName}</p>
                  <p className="text-[11px] text-navy/40 mt-0.5 truncate">{email || 'Verixa User'}</p>
                </div>

                <div className="py-1.5">
                  {[
                    { href: '/dashboard/profile', icon: User, label: 'My Profile' },
                    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link key={href} href={href} onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-navy/60 hover:text-navy hover:bg-navy/[0.04] transition-all">
                      <Icon size={14} className="text-navy/30" />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="py-1.5 border-t border-navy/5">
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('tokenType');
                      localStorage.removeItem('user');
                      window.location.href = '/auth/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={14} className="text-red-400" />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}