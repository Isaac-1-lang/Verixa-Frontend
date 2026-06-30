"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Clock, AlertCircle, Layers, PlayCircle, FileText, Target, ArrowUpRight, CheckSquare
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
    { title: "Requirements", value: analytics?.totalRequirements ?? 0, icon: <CheckSquare size={16} />, link: "/dashboard/requirements" },
    { title: "Test Cases", value: analytics?.totalTestCases ?? 0, icon: <FileText size={16} />, link: "/dashboard/test-cases" },
    { title: "Active Runs", value: analytics?.activeRuns ?? 0, icon: <PlayCircle size={16} />, link: "/dashboard/runs" },
    { title: "Pass Rate", value: `${analytics?.passRate ?? 0}%`, icon: <Target size={16} /> },
    { title: "Pending Executions", value: analytics?.pendingExecutions ?? 0, icon: <Clock size={16} />, link: "/dashboard/executions" },
    { title: "Open Defects", value: analytics?.openDefects ?? 0, icon: <AlertCircle size={16} />, link: "/dashboard/defects" },
  ];

  const quickActions = [
    { title: "New Project", icon: <Plus size={20} />, link: "/dashboard/projects" },
    { title: "Add Test Case", icon: <FileText size={20} />, link: "/dashboard/test-cases" },
    { title: "Add Requirement", icon: <CheckSquare size={20} />, link: "/dashboard/requirements" },
    { title: "New Test Run", icon: <PlayCircle size={20} />, link: "/dashboard/runs" },
    { title: "Log Defect", icon: <AlertCircle size={20} />, link: "/dashboard/defects" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-2">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-navy/40 text-sm sm:text-base font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions - Properly spaced layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        {quickActions.map((action, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1 }}>
            <Link href={action.link}
              className="group relative overflow-hidden bg-white border border-navy/5 rounded-xl p-4 sm:p-5 lg:p-6 hover:bg-navy/5 hover:border-navy/10 transition-all block shadow-lg shadow-navy/5 hover:shadow-2xl hover:shadow-navy/10">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy text-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-navy/10">
                  {action.icon}
                </div>
                <ArrowUpRight className="text-navy/10 group-hover:text-navy transition-colors" size={16} />
              </div>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-navy">{action.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid - 4 cards per row on large screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white border border-navy/5 rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-2xl hover:shadow-navy/10 transition-all group shadow-lg shadow-navy/5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy/5 rounded-full border border-navy/5 flex items-center justify-center text-navy group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-navy/40 mb-2">{stat.title}</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-1">{stat.value}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-sm sm:text-base font-bold text-navy/30 hover:text-navy mt-3 sm:mt-4 inline-block transition-all">
                View details →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity placeholder - Well spaced */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white border border-navy/5 rounded-xl p-5 sm:p-8 shadow-lg shadow-navy/5">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-1">Recent Activity</h2>
            <p className="text-base sm:text-lg font-medium text-navy/30">Activity tracking coming soon</p>
          </div>
        </div>
        <div className="text-center py-6 sm:py-10">
          <Clock className="mx-auto mb-3 sm:mb-4 text-navy/20" size={40} />
          <p className="text-navy/40 font-medium text-base sm:text-lg">No recent activity to display</p>
        </div>
      </motion.div>
    </div>
  );
}
