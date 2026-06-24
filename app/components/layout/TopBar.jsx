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
    <header className="h-14 bg-white border-b border-navy/6 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40"
      style={{ boxShadow: '0 1px 12px rgba(26,38,74,0.04)' }}
    >
      {/* Left — Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-navy/5 flex items-center justify-center text-navy/40 hover:text-navy transition-all"
        >
          <Menu size={16} />
        </button>

        {/* Search */}
        <div className={`ml-3 relative hidden md:flex items-center max-w-[320px] flex-1 transition-all duration-300`}>
          <div className="absolute left-3 text-navy/30 pointer-events-none">
            <Search size={13} />
          </div>
          <input
            type="text"
            placeholder="Search projects, tests, defects..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-8 pr-3 py-2 text-xs font-medium rounded-md border transition-all duration-200 outline-none
              ${searchFocused
                ? 'border-navy/20 bg-white shadow-sm shadow-navy/5 text-navy placeholder-navy/30'
                : 'border-navy/8 bg-navy/2 text-navy/60 placeholder-navy/20 hover:border-navy/15'
              }`}
          />
          {searchFocused && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-navy/20 border border-navy/10 rounded px-1 py-0.5">
              ⌘K
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        <button className="md:hidden w-8 h-8 rounded-lg hover:bg-navy/5 flex items-center justify-center text-navy/40 transition-all">
          <Search size={15} />
        </button>
      </div>

      {/* Right — Bell + Profile */}
      <div className="flex items-center gap-1.5 ml-3">

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setIsNotificationsOpen(v => !v); setIsProfileOpen(false); }}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isNotificationsOpen ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy hover:bg-navy/5'
              }`}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-red-500 rounded-full border border-white" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[320px] bg-white border border-navy/8 rounded-xl shadow-xl shadow-navy/10 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-navy/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-navy">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-navy text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
                    )}
                  </div>
                  <button className="text-[10px] font-bold text-navy/40 hover:text-navy transition-colors">Mark all read</button>
                </div>

                <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2.5 border-b border-navy/4 last:border-0 cursor-pointer transition-colors flex gap-2.5 ${!n.isRead ? 'bg-navy/2.5 hover:bg-navy/4' : 'hover:bg-navy/2'
                        }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-navy' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold leading-tight mb-0.5 ${!n.isRead ? 'text-navy' : 'text-navy/60'}`}>{n.title}</p>
                        <p className="text-[10px] text-navy/40 leading-relaxed">{n.body}</p>
                        <p className="text-[9px] font-bold text-navy/25 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2.5 border-t border-navy/5 bg-navy/1">
                  <Link href="/dashboard/notifications" onClick={() => setIsNotificationsOpen(false)}
                    className="text-[10px] font-bold text-navy/40 hover:text-navy transition-colors block text-center">
                    View all notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-navy/8 mx-0.5" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setIsProfileOpen(v => !v); setIsNotificationsOpen(false); }}
            className={`flex items-center gap-2 py-1 px-1.5 rounded-lg transition-all ${isProfileOpen ? 'bg-navy/5' : 'hover:bg-navy/4'
              }`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-navy flex items-center justify-center shadow-sm shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[10px] font-black">{initials}</span>
              )}
            </div>
            <div className="hidden sm:block text-left max-w-[90px]">
              <p className="text-[11px] font-bold text-navy leading-tight truncate">{fullName}</p>
              <p className="text-[9px] text-navy/35 font-medium truncate">{email || 'Verixa User'}</p>
            </div>
            <ChevronDown
              size={11}
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
                className="absolute right-0 mt-2 w-[200px] bg-white border border-navy/8 rounded-xl shadow-xl shadow-navy/10 z-50 overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-navy/5 bg-navy/1">
                  <p className="text-xs font-bold text-navy truncate">{fullName}</p>
                  <p className="text-[10px] text-navy/40 mt-0.5 truncate">{email || 'Verixa User'}</p>
                </div>

                <div className="py-1">
                  {[
                    { href: '/dashboard/profile', icon: User, label: 'My Profile' },
                    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link key={href} href={href} onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[11px] font-semibold text-navy/60 hover:text-navy hover:bg-navy/4 transition-all">
                      <Icon size={13} className="text-navy/30" />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="py-1 border-t border-navy/5">
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('tokenType');
                      localStorage.removeItem('user');
                      window.location.href = '/auth/login';
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={13} className="text-red-400" />
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