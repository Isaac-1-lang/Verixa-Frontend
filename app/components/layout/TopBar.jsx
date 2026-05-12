"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, Check } from 'lucide-react';

export default function TopBar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch (e) { }
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try { await markAsRead(notif.id); } catch (e) { }
    }
    setIsDropdownOpen(false);
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : "Guest";
  const userRole = user ? 'Student' : 'Guest';
  const avatarUrl =
    user?.profilePicture ||
    user?.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ffffff&color=1A264A&bold=true`;

  return (
    <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-navy/10 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-8 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2.5 rounded-md hover:bg-navy/5 text-navy/50 transition-colors" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="relative flex-1 max-w-md hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy/40 transition-colors" size={16} />
          <input type="text" placeholder="Search resources..."
            className="w-full bg-navy/3 border border-transparent rounded-md py-2.5 pl-11 pr-4 text-sm font-bold text-navy placeholder:text-navy/20 focus:outline-none focus:bg-white focus:border-navy/10 focus:ring-4 focus:ring-navy/5 transition-all" />
        </div>

        <button className="md:hidden p-2.5 rounded-md hover:bg-navy/5 text-navy/50 transition-colors">
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-8 ml-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 rounded-md hover:bg-navy/5 text-navy/30 hover:text-navy transition-all"
          >
            <Bell size={20} />
            {/* Unread dot */}
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-navy rounded-full ring-2 ring-white" />
          </button>

          {/* Notification Dropdown Box */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-96 bg-white border border-navy/10 rounded-md shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="p-5 border-b border-navy/5 flex justify-between items-center bg-navy/2">
                <h3 className="text-[10px] uppercase tracking-widest font-black text-navy/40">Notifications</h3>
                <span className="text-[10px] font-black bg-navy text-white px-2.5 py-1 rounded-md uppercase tracking-wider">Live</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {(notifications || []).length === 0 ? (
                  <div className="p-12 text-center text-navy/20 text-xs font-bold italic">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-5 border-b border-navy/5 last:border-0 cursor-pointer transition-all flex gap-4 ${!notif.isRead ? 'bg-navy/3 hover:bg-navy/5' : 'hover:bg-navy/2 opacity-60'}`}
                    >
                      <div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${!notif.isRead ? 'bg-navy shadow-[0_0_10px_rgba(26,38,74,0.4)]' : 'bg-navy/10'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold tracking-tight mb-1 ${!notif.isRead ? 'text-navy' : 'text-navy/50'}`}>{notif.title}</p>
                        <p className={`text-xs leading-relaxed font-medium ${!notif.isRead ? 'text-navy/60' : 'text-navy/30'}`}>{notif.body}</p>
                        <p className="text-[10px] font-bold text-navy/20 mt-3 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-navy/10" />
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System Log
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="text-navy/20 hover:text-navy transition-colors self-start mt-0.5">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-navy/5 bg-navy/2 text-center">
                <Link href="/dashboard/inbox" onClick={() => setIsDropdownOpen(false)} className="text-[10px] uppercase tracking-widest font-black text-navy/40 hover:text-navy transition-all">
                  View All Activity
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-navy/10 hidden sm:block"></div>

        <Link href="/dashboard/profile" className="flex items-center gap-4 cursor-pointer group py-1.5 px-2 rounded-md hover:bg-navy/5 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-navy leading-none mb-1 group-hover:text-navy/80 transition-colors">{fullName}</p>
            <p className="text-[10px] uppercase tracking-wider text-navy/30 font-black">{userRole}</p>
          </div>
          <div className="relative">
            <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-md object-cover border border-navy/10 shadow-lg shadow-navy/5 group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-md flex items-center justify-center border border-navy/5 shadow-sm">
              <ChevronDown size={10} className="text-navy/40" />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}