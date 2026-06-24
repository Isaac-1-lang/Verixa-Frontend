"use client";
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { ProjectProvider } from '../context/ProjectContext';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-[var(--bg)] selection:bg-navy selection:text-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-60 flex flex-col min-h-screen">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}