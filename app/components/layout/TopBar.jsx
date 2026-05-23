"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, Check, Settings, LogOut, User } from 'lucide-react';

export default function TopBar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Mock Notifications for design
  const notifications = [
    { id: 1, title: 'New Document Shared', body: 'Sarah left a comment on your physics assignment.', isRead: false, createdAt: new Date() },
    { id: 2, title: 'System Update', body: 'Maintenance scheduled for tonight at 12 AM.', isRead: true, createdAt: new Date() }
  ];

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch (e) { }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    setIsNotificationsOpen(false);
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : "John Doe";
  const userRole = user ? 'Student' : 'Administrator';
  const avatarUrl =
    user?.profilePicture ||
    user?.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f8f9fa&color=334155&bold=true`;

  return (
    <header className="h-[76px] bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="stroke-[1.5]" />
        </button>

        <div className="relative flex-1 max-w-[480px] hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for resources, student records..."
            className="block w-full pl-10 pr-4 py-2.5 border-0 rounded-2xl text-sm 
            bg-gray-50/80 text-gray-900 placeholder-gray-400 font-medium tracking-wide
            focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:outline-none transition-all duration-300"
          />
        </div>

        <button className="md:hidden p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors">
          <Search size={22} className="stroke-[1.5]" />
        </button>
      </div>

      <div className="flex items-center gap-7 ml-4 relative">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-full hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Bell size={22} className="stroke-[1.5]" />
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-[380px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden transform opacity-100 scale-100 origin-top-right transition-all">
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Mark all as read</button>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    You're all caught up!
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors flex gap-4 ${!notif.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50/80'}`}
                    >
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold mb-0.5 ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                        <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-gray-600' : 'text-gray-500'}`}>{notif.body}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-2">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                <Link href="/dashboard/notifications" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-7 w-px bg-gray-200 hidden sm:block"></div>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group py-1 px-1.5 rounded-full hover:bg-gray-50/80 transition-all border border-transparent hover:border-gray-100"
          >
            <div className="text-right hidden sm:block mr-1">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{fullName}</p>
              <p className="text-[11px] text-gray-500 font-medium">{userRole}</p>
            </div>
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white border border-gray-100 shadow-sm"
            />
            <ChevronDown size={14} className="text-gray-400 hidden sm:block mr-1" />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-[240px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden transform opacity-100 scale-100 origin-top-right transition-all">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email || 'admin@school.app'}</p>
              </div>
              <div className="py-2">
                <Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors">
                  <User size={16} className="text-gray-400" /> My Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors">
                  <Settings size={16} className="text-gray-400" /> Settings
                </Link>
              </div>
              <div className="py-2 border-t border-gray-50">
                <button className="w-full px-5 py-2.5 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors">
                  <LogOut size={16} className="text-red-400" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}