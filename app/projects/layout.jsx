"use client";
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">


      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-64 flex flex-col min-h-screen relative z-10">
        <TopBar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}