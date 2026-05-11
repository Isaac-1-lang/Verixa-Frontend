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
    <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-navy/5 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2.5 rounded-md hover:bg-navy/5 text-navy/50" aria-label="Open menu">
          <Menu size={22} />
        </button>

        <div className="relative flex-1 max-w-lg hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20 pointer-events-none" size={18} />
          <input type="text" placeholder="Search system..."
            className="w-full bg-offwhite border border-navy/10 rounded-md py-2.5 pl-12 pr-4 text-sm font-bold text-navy placeholder:text-navy/20 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all" />
        </div>

        <button className="md:hidden p-2.5 rounded-md hover:bg-navy/5 text-navy/50">
          <Search size={22} />
        </button>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 rounded-md hover:bg-navy/5 text-navy/40 hover:text-navy transition-all"
          >
            <Bell size={20} />
            {/* Unread dot */}
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-navy rounded-md shadow-lg" />
          </button>

          {/* Notification Dropdown Box */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-96 bg-white border border-navy/10 rounded-md shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="p-6 border-b border-navy/5 flex justify-between items-center bg-offwhite">
                <h3 className="text-xs font-bold text-navy/40">Notifications</h3>
                <span className="text-[10px] font-bold bg-navy text-white px-3 py-1 rounded-md">Active</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {(notifications || []).length === 0 ? (
                  <div className="p-12 text-center text-navy/20 text-xs font-bold">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-6 border-b border-navy/5 last:border-0 cursor-pointer transition-all flex gap-5 ${!notif.isRead ? 'bg-navy/5 hover:bg-navy/10' : 'hover:bg-navy/2 opacity-40'}`}
                    >
                      <div className={`w-1.5 h-1.5 mt-2 rounded-md shrink-0 ${!notif.isRead ? 'bg-navy shadow-lg shadow-navy/20' : 'bg-navy/10'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold tracking-tight ${!notif.isRead ? 'text-navy' : 'text-navy/50'}`}>{notif.title}</p>
                        <p className={`text-xs mt-2 leading-relaxed font-medium ${!notif.isRead ? 'text-navy/40' : 'text-navy/20'}`}>{notif.body}</p>
                        <p className="text-[10px] font-bold text-navy/20 mt-4">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System Log
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="text-navy/30 hover:text-navy transition-opacity">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-navy/5 bg-offwhite text-center">
                <Link href="/dashboard/inbox" onClick={() => setIsDropdownOpen(false)} className="text-xs font-bold text-navy/30 hover:text-navy transition-all">
                  Open Inbox
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-navy/5 hidden sm:block"></div>

        <Link href="/dashboard/profile" className="flex items-center gap-4 cursor-pointer group py-2 px-3 rounded-md hover:bg-navy/5 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-navy leading-none mb-1">{fullName}</p>
            <p className="text-xs text-navy/30 font-bold">{userRole}</p>
          </div>
          <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-md object-cover border border-navy/10 shadow-xl shadow-navy/5 group-hover:scale-105 transition-transform" />
          <ChevronDown size={14} className="text-navy/20 group-hover:text-navy transition-colors" />
        </Link>
      </div>
    </header>
  );
}