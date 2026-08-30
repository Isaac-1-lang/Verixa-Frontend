"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { ProjectProvider } from '../context/ProjectContext';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => typeof window !== "undefined" && localStorage.getItem("sidebarCollapsed") === "true");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/auth/login');
      return;
    }
  }, [router]);

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-[var(--bg)] selection:bg-navy selection:text-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(value => { const next = !value; localStorage.setItem("sidebarCollapsed", String(next)); return next; })} />
        
        <div className={(sidebarCollapsed ? "lg:ml-20" : "lg:ml-60") + " flex flex-col min-h-screen transition-[margin] duration-300"}>
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
