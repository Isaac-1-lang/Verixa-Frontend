"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, TrendingUp, Clock, 
  AlertCircle, Layers, PlayCircle, FileText, Target
} from "lucide-react";
import { useGetDashboardAnalyticsQuery } from "@/app/redux/api/DashboardApiSlice";

export default function DashboardPage() {
  const [userName, setUserName] = useState("QA Team");
  
  // Fetch real analytics from backend
  const { data: analytics, isLoading, error } = useGetDashboardAnalyticsQuery();

  useEffect(() => {
    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.username || "QA Team");
      }
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
      icon: <Layers size={20} />,
      color: "bg-slate-700",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      link: "/dashboard/projects"
    },
    {
      title: "Test Cases",
      value: stats.totalTestCases,
      icon: <FileText size={20} />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/dashboard/test-cases"
    },
    {
      title: "Active Runs",
      value: stats.activeRuns,
      icon: <PlayCircle size={20} />,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      link: "/dashboard/runs"
    },
    {
      title: "Pass Rate",
      value: `${stats.passRate}%`,
      icon: <Target size={20} />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+2.5%"
    },
    {
      title: "Pending Executions",
      value: stats.pendingExecutions,
      icon: <Clock size={20} />,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      link: "/dashboard/executions"
    },
    {
      title: "Open Defects",
      value: stats.openDefects,
      icon: <AlertCircle size={20} />,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      link: "/dashboard/defects"
    }
  ];

  const recentActivity = [
    { type: "execution", title: "Mobile App v2.0 - Login Test", status: "passed", time: "5 min ago" },
    { type: "defect", title: "Payment Gateway Timeout", status: "open", time: "1 hour ago" },
    { type: "run", title: "Sprint 23 UAT", status: "in_progress", time: "2 hours ago" },
    { type: "execution", title: "API Integration Tests", status: "failed", time: "3 hours ago" },
  ];

  const quickActions = [
    { title: "Create Project", icon: <Plus size={18} />, link: "/dashboard/projects", color: "bg-[var(--primary)]" },
    { title: "New Test Case", icon: <FileText size={18} />, link: "/dashboard/test-cases", color: "bg-purple-600" },
    { title: "Start Test Run", icon: <PlayCircle size={18} />, link: "/dashboard/runs", color: "bg-emerald-600" },
    { title: "Log Defect", icon: <AlertCircle size={18} />, link: "/dashboard/defects", color: "bg-red-600" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-zinc-600 text-sm font-medium mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            href={action.link}
            className="group relative overflow-hidden bg-white border-2 border-zinc-200 rounded-2xl p-4 hover:border-[var(--primary)] transition-all hover:shadow-lg hover:shadow-[var(--primary)]/10"
          >
            <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <p className="text-sm font-semibold text-zinc-900">{action.title}</p>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">{stat.value}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-xs font-semibold text-[var(--primary)] hover:underline mt-3 inline-block">
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
        </div>
        <div className="text-center py-12">
          <Clock className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-600 font-medium">Recent activity tracking coming soon</p>
          <p className="text-sm text-zinc-500 mt-2">View your latest test executions, defects, and runs</p>
        </div>
      </div>
    </div>
  );
}
