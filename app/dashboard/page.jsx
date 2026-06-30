"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Clock, AlertCircle, Layers, PlayCircle, FileText, Target, ArrowUpRight, CheckSquare, Upload, Download, Database
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetDashboardAnalyticsQuery } from "@/app/redux/api/DashboardApiSlice";
import ImportModal from "@/app/components/common/ImportModal";
import ExportButton from "@/app/components/common/ExportButton";
import toast from "react-hot-toast";
import { getLastName } from "@/app/utils/nameFormatter";

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState("testcase");
  const [importTitle, setImportTitle] = useState("Import Test Cases");
  const [recentImports, setRecentImports] = useState([
    { id: 1, type: "Test Cases", count: 45, date: "2024-01-15", status: "success" },
    { id: 2, type: "Requirements", count: 23, date: "2024-01-14", status: "success" },
    { id: 3, type: "Test Cases", count: 12, date: "2024-01-10", status: "success" },
  ]);

  const { data: analytics } = useGetDashboardAnalyticsQuery();

  // Dummy data for export (will be replaced with real data from API)
  const [exportData, setExportData] = useState({
    project: {
      title: "Verixa UAT Platform",
      projectStatus: "Ongoing",
      field: "Software Testing",
      description: "Comprehensive UAT management platform for test case execution, defect tracking, and quality sign-off.",
      createdAt: new Date(),
      updatedAt: new Date(),
      statistics: {
        totalRequirements: analytics?.totalRequirements || 23,
        totalTestCases: analytics?.totalTestCases || 45,
        totalRuns: analytics?.activeRuns || 5,
        totalExecutions: analytics?.pendingExecutions || 120,
        openDefects: analytics?.openDefects || 8,
        passRate: analytics?.passRate || 85,
      }
    },
    requirements: [
      { id: 1, title: "User Authentication", type: "Functional", priority: "High", status: "Approved", description: "System shall allow users to authenticate using email and password" },
      { id: 2, title: "Password Reset", type: "Functional", priority: "Medium", status: "Approved", description: "Users shall be able to reset their password via email" },
      { id: 3, title: "Response Time", type: "Non-Functional", priority: "High", status: "Draft", description: "System shall respond within 2 seconds" },
    ],
    testCases: [
      { id: 1, title: "Login with valid credentials", priority: "High", type: "Functional", description: "Verify user can login with valid email and password", expectedResult: "User successfully logged in" },
      { id: 2, title: "Login with invalid credentials", priority: "High", type: "Functional", description: "Verify system rejects invalid login", expectedResult: "Error message displayed" },
      { id: 3, title: "Password reset flow", priority: "Medium", type: "Functional", description: "Verify password reset email is sent", expectedResult: "Reset email received" },
    ],
    executions: [
      { id: 1, testCaseTitle: "Login with valid credentials", result: "Pass", executedBy: "QA Team", executedAt: new Date() },
      { id: 2, testCaseTitle: "Login with invalid credentials", result: "Pass", executedBy: "QA Team", executedAt: new Date() },
      { id: 3, testCaseTitle: "Password reset flow", result: "Fail", executedBy: "QA Team", executedAt: new Date() },
    ],
    defects: [
      { id: 1, title: "Password reset email not received", severity: "High", status: "Open" },
      { id: 2, title: "UI alignment issue on mobile", severity: "Low", status: "Open" },
    ],
    statistics: {
      passRate: analytics?.passRate || 85
    }
  });

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
        // Extract last name from full name
        const fullName = user.fullName || "User";
        setUserName(getLastName(fullName));
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

  // Handle bulk import
  const handleBulkImport = async (data) => {
    // Simulate API call - replace with actual API integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Importing ${importType}:`, data);
    
    // Add to recent imports
    const newImport = {
      id: Date.now(),
      type: importType === 'testcase' ? 'Test Cases' : 'Requirements',
      count: data.length,
      date: new Date().toISOString().split('T')[0],
      status: 'success'
    };
    
    setRecentImports(prev => [newImport, ...prev.slice(0, 4)]);
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/bulk-import', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type: importType, data })
    // });
    
    return data;
  };

  // Open import modal with specific type
  const openImportModal = (type, title) => {
    setImportType(type);
    setImportTitle(title);
    setImportModalOpen(true);
  };

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
        
        {/* Export Button */}
        <div className="flex items-center gap-3">
          <ExportButton 
            data={exportData}
            projectName={exportData.project.title}
          />
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

      {/* Bulk Import Section */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                <Database size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy">Bulk Import Data</h2>
                <p className="text-sm sm:text-base text-navy/60 font-medium">Upload Excel, CSV, or text files</p>
              </div>
            </div>
            <p className="text-base text-navy/70 mb-4">
              Save time by importing test cases, requirements, and other data in bulk. Support for Excel (.xlsx, .xls), CSV, and text files with validation.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openImportModal('testcase', 'Import Test Cases')}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
              >
                <Upload size={18} />
                Import Test Cases
              </button>
              
              <button
                onClick={() => openImportModal('requirement', 'Import Requirements')}
                className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-md"
              >
                <Upload size={18} />
                Import Requirements
              </button>
              
              <button
                onClick={() => toast.info('Download templates from the import modal')}
                className="flex items-center gap-2 px-5 py-3 bg-white/80 text-navy border border-navy/20 rounded-xl font-bold text-sm hover:bg-white hover:border-navy/40 transition-all"
              >
                <Download size={18} />
                Get Templates
              </button>
            </div>
          </div>

          {/* Recent Imports */}
          <div className="lg:w-96 bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Recent Imports
            </h3>
            
            {recentImports.length > 0 ? (
              <div className="space-y-3">
                {recentImports.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-navy">{item.type}</p>
                      <p className="text-xs text-navy/50">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{item.count}</p>
                      <p className="text-xs text-emerald-600 font-semibold">✓ Success</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy/40 text-center py-4">No recent imports</p>
            )}
          </div>
        </div>
      </motion.div>

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

      {/* Import Modal */}
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleBulkImport}
        type={importType}
        title={importTitle}
      />
    </div>
  );
}
