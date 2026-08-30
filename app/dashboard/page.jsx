"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Clock, AlertCircle, Layers, PlayCircle, FileText, Target, ArrowUpRight, CheckSquare, Upload, Download, Database, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetDashboardAnalyticsQuery } from "@/app/redux/api/DashboardApiSlice";
import { useGetMeQuery, useGetTrainingProgramsQuery } from "@/app/redux/api/TrainingApiSlice";
import ImportModal from "@/app/components/common/ImportModal";
import ExportButton from "@/app/components/common/ExportButton";
import toast from "react-hot-toast";
import { getLastName } from "@/app/utils/nameFormatter";

export default function DashboardPage() {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState("testcase");
  const [importTitle, setImportTitle] = useState("Import Test Cases");
  const [recentImports, setRecentImports] = useState([
    { id: 1, type: "Test Cases", count: 45, date: "2024-01-15", status: "success" },
    { id: 2, type: "Requirements", count: 23, date: "2024-01-14", status: "success" },
    { id: 3, type: "Test Cases", count: 12, date: "2024-01-10", status: "success" },
  ]);

  const { data: analytics } = useGetDashboardAnalyticsQuery();
  const { data: me } = useGetMeQuery();
  const organizationId = me?.organizations?.[0]?.id;
  const { data: trainingPrograms } = useGetTrainingProgramsQuery({ organizationId, page: 0, size: 1 }, { skip: !organizationId });
  const trainingProgramCount = trainingPrograms?.totalElements ?? (Array.isArray(trainingPrograms) ? trainingPrograms.length : 0);

  // Dummy data for export (will be replaced with real data from API)
  const [exportData] = useState({
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
      }
    } catch {}
  }, []);

  const userName = getLastName(me?.fullName || "User");

  const statCards = [
    { title: "Total Projects", value: analytics?.totalProjects ?? 0, icon: <Layers size={16} />, link: "/dashboard/projects" },
    { title: "Requirements", value: analytics?.totalRequirements ?? 0, icon: <CheckSquare size={16} />, link: "/dashboard/requirements" },
    { title: "Test Cases", value: analytics?.totalTestCases ?? 0, icon: <FileText size={16} />, link: "/dashboard/test-cases" },
    { title: "Active Runs", value: analytics?.activeRuns ?? 0, icon: <PlayCircle size={16} />, link: "/dashboard/runs" },
    { title: "Pass Rate", value: `${analytics?.passRate ?? 0}%`, icon: <Target size={16} /> },
    { title: "Pending Executions", value: analytics?.pendingExecutions ?? 0, icon: <Clock size={16} />, link: "/dashboard/executions" },
    { title: "Open Defects", value: analytics?.openDefects ?? 0, icon: <AlertCircle size={16} />, link: "/dashboard/defects" },
    { title: "Training Programs", value: trainingProgramCount, icon: <GraduationCap size={16} />, link: "/dashboard/training" },
  ];

  const quickActions = [
    { title: "New Project", icon: <Plus size={20} />, link: "/dashboard/projects/new" },
    { title: "Add Test Case", icon: <FileText size={20} />, link: "/dashboard/test-cases" },
    { title: "Add Requirement", icon: <CheckSquare size={20} />, link: "/dashboard/requirements" },
    { title: "New Test Run", icon: <PlayCircle size={20} />, link: "/dashboard/runs" },
    { title: "Log Defect", icon: <AlertCircle size={20} />, link: "/dashboard/defects" },
    { title: "Training", icon: <GraduationCap size={20} />, link: "/dashboard/training" },
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
            Welcome back, {userName}!
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

      <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy/6 px-5 py-4 sm:px-6">
            <div><h2 className="font-bold text-navy">Workspace overview</h2><p className="mt-0.5 text-xs text-navy/40">Live delivery and quality indicators</p></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const content = <><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-navy/5 text-navy">{stat.icon}</span>{stat.link && <ArrowUpRight size={14} className="text-navy/20 transition-colors group-hover:text-navy" />}</div><p className="mt-5 text-2xl font-bold tracking-tight text-navy sm:text-3xl">{stat.value}</p><p className="mt-1 text-xs font-semibold text-navy/40">{stat.title}</p></>;
              return stat.link ? <Link key={stat.title} href={stat.link} className="group min-h-36 border-b border-r border-navy/6 p-5 transition-colors hover:bg-navy/[.025]">{content}</Link> : <div key={stat.title} className="group min-h-36 border-b border-r border-navy/6 p-5">{content}</div>;
            })}
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }} className="rounded-2xl bg-navy p-5 text-white shadow-xl shadow-navy/10">
          <div className="mb-4 px-1"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">Shortcuts</p><h2 className="mt-1 text-lg font-bold">Quick actions</h2></div>
          <nav className="grid grid-cols-2 gap-2 xl:grid-cols-1">
            {quickActions.map((action, idx) => <motion.div key={action.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 + idx * 0.04 }}><Link href={action.link} className="group flex min-h-14 items-center gap-3 rounded-xl border border-white/8 bg-white/[.055] px-3 py-2.5 transition-colors hover:bg-white/12"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-navy">{action.icon}</span><span className="min-w-0 flex-1 text-sm font-bold">{action.title}</span><ArrowUpRight size={14} className="hidden text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" /></Link></motion.div>)}
          </nav>
        </motion.aside>
      </section>

      {/* Bulk Import Section */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-navy/[0.03] border-2 border-navy/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-navy/15">
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
                className="flex items-center gap-2 px-5 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-navy/90 transition-all shadow-md hover:shadow-xl"
              >
                <Upload size={18} />
                Import Test Cases
              </button>
              
              <button
                onClick={() => openImportModal('requirement', 'Import Requirements')}
                className="flex items-center gap-2 px-5 py-3 bg-white text-navy border-2 border-navy rounded-xl font-bold text-sm hover:bg-navy/5 transition-all shadow-md"
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
          <div className="lg:w-96 bg-white rounded-xl p-5 shadow-md border border-navy/10">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Clock size={18} className="text-navy" />
              Recent Imports
            </h3>
            
            {recentImports.length > 0 ? (
              <div className="space-y-3">
                {recentImports.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-navy/[0.03] rounded-lg border border-navy/10">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-navy">{item.type}</p>
                      <p className="text-xs text-navy/50">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-navy">{item.count}</p>
                      <p className="text-xs text-emerald-600 font-semibold">âœ“ Success</p>
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
