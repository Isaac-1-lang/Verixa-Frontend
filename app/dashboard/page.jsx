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
    { title: "Total Projects", value: analytics?.totalProjects ?? 0, icon: <Layers size={22} />, link: "/dashboard/projects" },
    { title: "Test Cases", value: analytics?.totalTestCases ?? 0, icon: <FileText size={22} />, link: "/dashboard/test-cases" },
    { title: "Active Runs", value: analytics?.activeRuns ?? 0, icon: <PlayCircle size={22} />, link: "/dashboard/runs" },
    { title: "Pass Rate", value: `${analytics?.passRate ?? 0}%`, icon: <Target size={22} /> },
    { title: "Pending Executions", value: analytics?.pendingExecutions ?? 0, icon: <Clock size={22} />, link: "/dashboard/executions" },
    { title: "Open Defects", value: analytics?.openDefects ?? 0, icon: <AlertCircle size={22} />, link: "/dashboard/defects" },
  ];

  const quickActions = [
    { title: "New Project", icon: <Plus size={20} />, link: "/dashboard/projects" },
    { title: "Add Test Case", icon: <FileText size={20} />, link: "/dashboard/test-cases" },
    { title: "New Test Run", icon: <PlayCircle size={20} />, link: "/dashboard/runs" },
    { title: "Log Defect", icon: <AlertCircle size={20} />, link: "/dashboard/defects" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-navy/40 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {quickActions.map((action, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1 }}>
            <Link href={action.link}
              className="group relative overflow-hidden bg-white border border-navy/5 rounded-md p-8 hover:bg-navy/5 hover:border-navy/10 transition-all block">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-navy text-white rounded-md flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-navy/10">
                  {action.icon}
                </div>
                <ArrowUpRight className="text-navy/10 group-hover:text-navy transition-colors" size={20} />
              </div>
              <p className="text-sm font-bold text-navy">{action.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white border border-navy/5 rounded-md p-10 hover:shadow-xl hover:shadow-navy/5 transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-navy/5 rounded-md border border-navy/5 flex items-center justify-center text-navy group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-navy/40 mb-2">{stat.title}</p>
              <p className="text-5xl font-bold text-navy">{stat.value}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-xs font-bold text-navy/30 hover:text-navy mt-8 inline-block transition-all">
                View details →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white border border-navy/5 rounded-md p-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-1">Recent Activity</h2>
            <p className="text-sm font-medium text-navy/30">Activity tracking coming soon</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Clock className="mx-auto mb-4 text-navy/20" size={48} />
          <p className="text-navy/40 font-medium text-sm">No recent activity to display</p>
        </div>
      </motion.div>
    </div>
  );
}
