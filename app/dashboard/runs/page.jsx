"use client";
import { useState } from "react";
import { Plus, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/common/DataTable";

export default function RunsPage() {
  const [runs] = useState([
    { id: 1, name: "Sprint 23 UAT", project: "Mobile App v2.0", status: "In Progress", progress: 65, startDate: "2024-02-20", testCases: 45, passed: 29, failed: 0, pending: 16 },
    { id: 2, name: "Payment Integration Test", project: "Payment Gateway", status: "Completed", progress: 100, startDate: "2024-02-18", testCases: 32, passed: 30, failed: 2, pending: 0 },
    { id: 3, name: "Regression Suite", project: "E-commerce Platform", status: "Planned", progress: 0, startDate: "2024-02-25", testCases: 89, passed: 0, failed: 0, pending: 89 },
  ]);

  const columns = [
    {
      header: "Operation Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <PlayCircle size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-sm">{row.name}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">{row.project}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-md ${row.status === 'In Progress' ? 'bg-navy animate-pulse' : 'bg-navy/10'}`} />
          <span className={`text-xs font-bold ${row.status === 'In Progress' ? 'text-navy' : 'text-navy/20'}`}>
            {row.status}
          </span>
        </div>
      ),
    },
    {
      header: "Progress",
      accessor: "progress",
      cell: (row) => (
        <div className="w-full max-w-[140px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-navy/40 mb-2">
            <span>{row.progress}% sync</span>
          </div>
          <div className="w-full bg-navy/5 rounded-md h-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${row.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-navy h-full transition-all"
            />
          </div>
        </div>
      ),
    },
    {
      header: "Telemetry",
      accessor: "results",
      cell: (row) => (
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald leading-none">{row.passed}</span>
            <span className="text-[9px] font-bold text-navy/20 mt-1">Pass</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-navy/40 leading-none">{row.failed}</span>
            <span className="text-[9px] font-bold text-navy/20 mt-1">Fail</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-navy/20 leading-none">{row.pending}</span>
            <span className="text-[9px] font-bold text-navy/20 mt-1">Wait</span>
          </div>
        </div>
      ),
    },
    {
      header: "Initiation",
      accessor: "startDate",
      cell: (row) => <span className="text-xs font-bold text-navy/30">{new Date(row.startDate).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Test Runs</h1>
          <p className="text-navy/40 text-sm font-medium">Active execution streams and progress monitoring</p>
        </div>
        <button className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
          <Plus size={20} strokeWidth={2.5} /> Initialize Test Run
        </button>
      </div>

      <DataTable
        columns={columns}
        data={runs}
        searchPlaceholder="Search test runs..."
        onRowClick={(row) => console.log('Clicked:', row)}
        emptyMessage="No test runs found. Create your first test run to get started."
      />
    </div>
  );
}
