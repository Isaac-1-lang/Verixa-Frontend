"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
<<<<<<< HEAD
import {
  Plus, TrendingUp, CheckCircle, XCircle, Clock,
  AlertCircle, Layers, PlayCircle, FileText, Target,
  ArrowUpRight, Activity as ActivityIcon
} from "lucide-react";
import { motion } from "framer-motion";
=======
import { 
  Plus, TrendingUp, Clock, 
  AlertCircle, Layers, PlayCircle, FileText, Target
} from "lucide-react";
import { useGetDashboardAnalyticsQuery } from "@/app/redux/api/DashboardApiSlice";
>>>>>>> Integration

export default function DashboardPage() {
  const [userName, setUserName] = useState("QA Team");
  
  // Fetch real analytics from backend
  const { data: analytics, isLoading, error } = useGetDashboardAnalyticsQuery();

  const [recentActivity, setRecentActivity] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.username || "QA Team");
      }
<<<<<<< HEAD

      // TODO: Fetch actual user data from API
      setUserName("QA Team");

      // TODO: Fetch actual stats from API
      setStats({
        totalProjects: 5,
        totalTestCases: 245,
        activeRuns: 3,
        passRate: 94,
        pendingExecutions: 12,
        openDefects: 8
      });
=======
>>>>>>> Integration
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  const stats = {
    totalProjects: analytics?.totalProjects || 0,
    totalTestCases: analytics?.totalTestCases || 0,
    activeRuns: analytics?.activeRuns || 0,
    passRate: analytics?.passRate || 0,
    pendingExecutions: analytics?.pendingExecutions || 0,
    openDefects: analytics?.openDefects || 0
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <Layers size={22} />,
      link: "/dashboard/projects"
    },
    {
      title: "Test Cases",
      value: stats.totalTestCases,
      icon: <FileText size={22} />,
      link: "/dashboard/test-cases"
    },
    {
      title: "Active Runs",
      value: stats.activeRuns,
      icon: <PlayCircle size={22} />,
      link: "/dashboard/runs"
    },
    {
      title: "Pass Rate",
      value: `${stats.passRate}%`,
      icon: <Target size={22} />,
      trend: "+2.5%"
    },
    {
      title: "Pending Executions",
      value: stats.pendingExecutions,
      icon: <Clock size={22} />,
      link: "/dashboard/executions"
    },
    {
      title: "Open Defects",
      value: stats.openDefects,
      icon: <AlertCircle size={22} />,
      link: "/dashboard/defects"
    }
  ];

  const quickActions = [
    { title: "NEW_PROJECT", icon: <Plus size={20} />, link: "/dashboard/projects" },
    { title: "ADD_TEST_CASE", icon: <FileText size={20} />, link: "/dashboard/test-cases" },
    { title: "INITIALIZE_RUN", icon: <PlayCircle size={20} />, link: "/dashboard/runs" },
    { title: "LOG_DEFECT", icon: <AlertCircle size={20} />, link: "/dashboard/defects" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16"
      >
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-navy/40 text-sm font-medium">
            Operational Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 rounded-md bg-navy/5 text-navy font-bold text-xs shadow-sm shadow-navy/5 shrink-0">
            Status: Fully Operational
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {quickActions.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
          >
            <Link
              href={action.link}
              className="group relative overflow-hidden bg-offwhite border border-navy/5 rounded-md p-8 hover:bg-navy/5 hover:border-navy/10 transition-all block"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-navy text-white rounded-md flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-navy/10">
                  {action.icon}
                </div>
                <ArrowUpRight className="text-navy/10 group-hover:text-navy transition-colors" size={20} />
              </div>
              <p className="text-sm font-bold text-navy">{action.title === 'NEW_PROJECT' ? 'New Project' : action.title === 'ADD_TEST_CASE' ? 'Add Test Case' : action.title === 'INITIALIZE_RUN' ? 'New Test Run' : 'Log Defect'}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white border border-navy/5 rounded-md p-10 hover:shadow-xl hover:shadow-navy/5 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/2 rounded-md group-hover:bg-navy/4 transition-colors" />

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="w-16 h-16 bg-navy/5 rounded-md border border-navy/5 flex items-center justify-center text-navy group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-xs font-bold text-navy bg-navy/5 px-3 py-1.5 rounded-md border border-navy/5">
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-navy/40 mb-2">{stat.title}</p>
              <p className="text-5xl font-bold text-navy">{stat.value}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-xs font-bold text-navy/30 hover:text-navy mt-8 inline-block transition-all">
                View detailed logs →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
<<<<<<< HEAD
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-offwhite border border-navy/5 rounded-md p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="flex items-center justify-between mb-12 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-1">Recent Activity</h2>
            <p className="text-sm font-medium text-navy/30">Latest updates from your QA streams</p>
          </div>
          <Link href="/dashboard/executions" className="text-xs font-bold text-navy/30 hover:text-navy transition-all border-b border-navy/10 hover:border-navy/40 pb-1">
            View full stream
          </Link>
        </div>

        <div className="space-y-4 relative z-10">
          {(recentActivity || [
            { type: "execution", title: "MOBILE_APP_V2.0::AUTH_PASS", status: "PASSED", time: "5 MIN AGO" },
            { type: "defect", title: "PAYMENT_GATEWAY::INTERNAL_REV", status: "OPEN", time: "1 HOUR AGO" },
            { type: "run", title: "SPRINT_23_UAT::VALIDATION", status: "STABLE", time: "2 HOURS AGO" },
          ]).map((activity, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 10, backgroundColor: 'rgba(26,38,74,0.02)' }}
              className="flex items-center gap-8 p-6 rounded-md transition-all cursor-pointer border border-navy/2 bg-white shadow-sm shadow-navy/2"
            >
              <div className="w-12 h-12 rounded-md bg-navy/5 flex items-center justify-center text-navy/40 group-hover:text-navy">
                <ActivityIcon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-navy truncate">{activity.title.toLowerCase().split('::').join(' — ')}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-navy/30 font-bold">{activity.time}</p>
                  <span className="w-1 h-1 rounded-md bg-navy/10" />
                  <p className="text-xs text-navy/40 font-medium capitalize">{activity.type}</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-4 py-1.5 rounded-md border ${activity.status === 'PASSED' ? 'bg-emerald/5 border-emerald/10 text-emerald' : 'bg-navy/5 border-navy/10 text-navy'}`}>
                {activity.status.replace('_', ' ')}
              </span>
            </motion.div>
          ))}
=======
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
        </div>
        <div className="text-center py-12">
          <Clock className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-600 font-medium">Recent activity tracking coming soon</p>
          <p className="text-sm text-zinc-500 mt-2">View your latest test executions, defects, and runs</p>
>>>>>>> Integration
        </div>
      </motion.div>
    </div>
  );
}
