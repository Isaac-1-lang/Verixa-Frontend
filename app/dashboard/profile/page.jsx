"use client";
import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Shield } from 'lucide-react';
import { useGetCurrentUserProfileQuery } from '@/app/redux/api/DashboardApiSlice';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <div className="p-8 text-zinc-600">Loading Profile...</div>;
  }

  if (!userProfile) {
    return <div className="p-8 text-zinc-600">Unable to load profile</div>;
  }

  const fullName = userProfile.fullName || "User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6C63FF&color=fff&bold=true`;

  return (
    <div className="max-w-[960px] mx-auto pb-10">
      {/* Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
        <div className="absolute -bottom-12 left-8 flex items-end gap-5">
          <div className="relative w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg border border-zinc-200">
            <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="mb-14">
            <h1 className="text-2xl font-extrabold text-white">{fullName}</h1>
            <p className="text-white/70 text-sm font-medium">{userProfile.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl p-8 border border-zinc-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 mb-1">Profile Information</h2>
            <p className="text-zinc-600 text-sm">Your account details</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <UserIcon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">{userProfile.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Mail size={20} />
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
