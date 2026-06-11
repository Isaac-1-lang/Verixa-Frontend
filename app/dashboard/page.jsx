"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Clock, AlertCircle, Layers, PlayCircle, FileText, Target, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetDashboardAnalyticsQuery } from "@/app/redux/api/DashboardApiSlice";

export default function DashboardPage() {
  const [userName, setUserName] = useState("QA Team");

  const { data: analytics } = useGetDashboardAnalyticsQuery();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || "QA Team");
      }
    } catch (_) {}
  }, []);

  const statCards = [
    { title: "Total Projects", value: analytics?.totalProjects ?? 0, icon: <Layers size={16} />, link: "/dashboard/projects" },
    { title: "Test Cases", value: analytics?.totalTestCases ?? 0, icon: <FileText size={16} />, link: "/dashboard/test-cases" },
    { title: "Active Runs", value: analytics?.activeRuns ?? 0, icon: <PlayCircle size={16} />, link: "/dashboard/runs" },
    { title: "Pass Rate", value: `${analytics?.passRate ?? 0}%`, icon: <Target size={16} /> },
    { title: "Pending Executions", value: analytics?.pendingExecutions ?? 0, icon: <Clock size={16} />, link: "/dashboard/executions" },
    { title: "Open Defects", value: analytics?.openDefects ?? 0, icon: <AlertCircle size={16} />, link: "/dashboard/defects" },
  ];

  const quickActions = [
    { title: "New Project", icon: <Plus size={20} />, link: "/dashboard/projects" },
    { title: "Add Test Case", icon: <FileText size={20} />, link: "/dashboard/test-cases" },
    { title: "New Test Run", icon: <PlayCircle size={20} />, link: "/dashboard/runs" },
    { title: "Log Defect", icon: <AlertCircle size={20} />, link: "/dashboard/defects" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy leading-tight mb-1">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-navy/40 text-xs font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1 }}>
            <Link href={action.link}
              className="group relative overflow-hidden bg-white/80 border border-navy/5 rounded-lg p-5 hover:bg-navy/5 hover:border-navy/10 transition-all block">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-navy/10">
                  {action.icon}
                </div>
                <ArrowUpRight className="text-navy/10 group-hover:text-navy transition-colors" size={16} />
              </div>
              <p className="text-xs font-bold text-navy">{action.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white/80 border border-navy/5 rounded-lg p-4 hover:shadow-lg hover:shadow-navy/5 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-navy/5 rounded-full border border-navy/5 flex items-center justify-center text-navy group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-navy/40 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-navy">{stat.value}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-[11px] font-bold text-navy/30 hover:text-navy mt-3 inline-block transition-all">
                View details →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white/80 border border-navy/5 rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-navy mb-0.5">Recent Activity</h2>
            <p className="text-xs font-medium text-navy/30">Activity tracking coming soon</p>
          </div>
        </div>
        <div className="text-center py-6">
          <Clock className="mx-auto mb-3 text-navy/20" size={32} />
          <p className="text-navy/40 font-medium text-xs">No recent activity to display</p>
        </div>
      </motion.div>
    </div>
  );
}
