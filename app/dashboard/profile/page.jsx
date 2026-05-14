"use client";
import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Shield } from 'lucide-react';
import { useGetCurrentUserProfileQuery } from '@/app/redux/api/DashboardApiSlice';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <div className="p-8 text-zinc-600">Loading Profile...</div>;
  }

<<<<<<< HEAD
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) { try { setUser(JSON.parse(userStr)); } catch (e) { } }
    const extraStr = localStorage.getItem('Verixa_extra_profile');
    if (extraStr) { try { setExtraProfile(JSON.parse(extraStr)); } catch (e) { } }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('Verixa_extra_profile', JSON.stringify(extraProfile));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraProfile(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return <div className="p-12 text-navy/20 font-bold text-sm">Initializing profile...</div>;

  const fullNameRaw = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
  const fullName = toTitleCase(fullNameRaw);
  const avatarUrl =
    user.profilePicture ||
    user.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6C63FF&color=fff&bold=true`;
=======
  if (!userProfile) {
    return <div className="p-8 text-zinc-600">Unable to load profile</div>;
  }

  const fullName = userProfile.fullName || "User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6C63FF&color=fff&bold=true`;
>>>>>>> Integration

  return (
    <div className="max-w-[960px] mx-auto pb-10">
      {/* Banner */}
<<<<<<< HEAD
      <div className="relative w-full h-44 sm:h-56 rounded-md overflow-hidden mb-16 bg-navy/5 border border-navy/5">
        <div className="absolute inset-0 bg-navy/5 opacity-50" />
        <button className="absolute top-6 right-6 bg-navy text-white px-5 py-2.5 rounded-md text-xs font-bold shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
          <Camera size={14} strokeWidth={2.5} /> Edit Cover
        </button>
        <div className="absolute -bottom-16 left-12 flex items-end gap-8">
          <div className="relative group cursor-pointer w-32 h-32 rounded-md bg-white p-1 shadow-2xl border-4 border-offwhite overflow-hidden">
            <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-md object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
              <Camera size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mb-20">
            <h1 className="text-5xl font-bold text-navy leading-none">{fullName}</h1>
            <p className="text-navy/30 text-sm font-medium mt-2">@{user.username}</p>
=======
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
        <div className="absolute -bottom-12 left-8 flex items-end gap-5">
          <div className="relative w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg border border-zinc-200">
            <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="mb-14">
            <h1 className="text-2xl font-extrabold text-white">{fullName}</h1>
            <p className="text-white/70 text-sm font-medium">{userProfile.email}</p>
>>>>>>> Integration
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-navy/10 rounded-md p-3 sticky top-28 shadow-xl shadow-navy/5">
            {[
              { key: 'general', icon: <UserIcon size={16} />, label: 'Profile' },
              { key: 'security', icon: <Shield size={16} />, label: 'Security' },
              { key: 'preferences', icon: <Settings size={16} />, label: 'Preferences' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === tab.key ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40 hover:text-navy hover:bg-navy/5'
                  }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
=======
      {/* Profile Info */}
      <div className="bg-white rounded-2xl p-8 border border-zinc-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 mb-1">Profile Information</h2>
            <p className="text-zinc-600 text-sm">Your account details</p>
>>>>>>> Integration
          </div>

<<<<<<< HEAD
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-navy/10 rounded-md p-12 shadow-xl shadow-navy/5">

            {activeTab === 'general' && (
              <div className="space-y-12 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-navy mb-1">General Information</h2>
                  <p className="text-navy/40 text-sm font-medium">Update your primary identity information</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-navy/40 mb-3">First Name</label>
                    <input type="text" disabled defaultValue={toTitleCase(user.firstName)} className="w-full bg-offwhite border border-navy/5 rounded-md py-4 px-6 text-sm text-navy/50 font-bold cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/40 mb-3">Last Name</label>
                    <input type="text" disabled defaultValue={toTitleCase(user.lastName)} className="w-full bg-offwhite border border-navy/5 rounded-md py-4 px-6 text-sm text-navy/50 font-bold cursor-not-allowed" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-navy/40 mb-3">Email Address</label>
                    <input type="email" disabled defaultValue={user.email} className="w-full bg-offwhite border border-navy/5 rounded-md py-4 px-6 text-sm text-navy/50 font-bold cursor-not-allowed" />
                  </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-navy/40">Biography</h3>
                  <textarea name="bio" value={extraProfile.bio} onChange={handleExtraChange}
                    className="w-full bg-offwhite border border-navy/10 rounded-md py-6 px-8 text-sm text-navy font-medium resize-none h-32 focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none transition-all placeholder:text-navy/20"
                    placeholder="Tell us about yourself..." />
                </div>

                <div className="w-full h-px bg-navy/5" />

                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-navy/40">Social Links</h3>
                  {[
                    { icon: <Github size={16} />, name: 'github', placeholder: 'GitHub Profile URL' },
                    { icon: <Linkedin size={16} />, name: 'linkedin', placeholder: 'LinkedIn Profile URL' },
                    { icon: <Globe size={16} />, name: 'portfolio', placeholder: 'Portfolio Website' },
                  ].map(s => (
                    <div key={s.name} className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy/60 transition-colors">{s.icon}</span>
                      <input type="url" name={s.name} value={extraProfile[s.name]} onChange={handleExtraChange}
                        className="w-full bg-offwhite border border-navy/10 rounded-md py-4 pl-16 pr-6 text-sm text-navy font-bold focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none transition-all placeholder:text-navy/20"
                        placeholder={s.placeholder} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-3 shrink-0 bg-navy text-white px-10 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all disabled:opacity-50">
                    {isSaving ? <span className="w-5 h-5 rounded-md border-[3px] border-white/20 border-t-white animate-spin"></span>
                      : <>{saveSuccess ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Save size={20} strokeWidth={2.5} />} {saveSuccess ? 'Changes Saved' : 'Save Changes'}</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-navy mb-1">Security Settings</h2>
                  <p className="text-navy/40 text-sm font-medium">Update your access credentials and protect your account</p>
                </div>
                <div className="space-y-6 max-w-sm">
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-navy/40 mb-3">{label}</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-offwhite border border-navy/10 rounded-md py-4 px-6 text-sm text-navy font-bold focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none transition-all" />
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-4 bg-navy text-white px-10 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
                  Update Password
                </button>
=======
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <UserIcon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">{userProfile.fullName}</p>
>>>>>>> Integration
              </div>
            </div>

<<<<<<< HEAD
            {activeTab === 'preferences' && (
              <div className="space-y-12 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-navy mb-1">Preferences</h2>
                  <p className="text-navy/40 text-sm font-medium">Manage your notification settings and platform experience</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Platform Updates', desc: 'Global announcements and system updates', on: true },
                    { label: 'Team Collaboration', desc: 'Notifications for mentions and project activity', on: true },
                    { label: 'Weekly Digest', desc: 'A summary of your weekly testing metrics', on: false },
                  ].map(pref => (
                    <div key={pref.label} className="flex items-center justify-between p-8 bg-offwhite border border-navy/5 rounded-md hover:bg-navy/5 transition-all group">
                      <div>
                        <p className="text-base font-bold text-navy group-hover:translate-x-1 transition-transform">{pref.label}</p>
                        <p className="text-xs font-medium text-navy/40 mt-1">{pref.desc}</p>
                      </div>
                      <div className={`w-14 h-7 rounded-md relative transition-all duration-300 cursor-pointer ${pref.on ? 'bg-navy' : 'bg-navy/10 border border-navy/5'}`}>
                        <div className={`absolute top-1 w-5 h-5 rounded-md transition-all duration-300 shadow-sm ${pref.on ? 'right-1 bg-white' : 'left-1 bg-navy/20'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
=======
            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Mail size={20} />
>>>>>>> Integration
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">{userProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 mt-1">
                  {userProfile.role || 'Admin'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                userProfile.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                <div className={`w-3 h-3 rounded-full ${userProfile.active ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Account Status</p>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                  {userProfile.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
