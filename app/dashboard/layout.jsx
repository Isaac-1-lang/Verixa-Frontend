"use client";
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-navy selection:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-80 flex flex-col min-h-screen transition-all duration-500">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}