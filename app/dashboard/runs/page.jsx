"use client";
import { useState } from "react";
import { Plus, PlayCircle } from "lucide-react";
import DataTable from "../../components/common/DataTable";

export default function RunsPage() {
  const [runs] = useState([
    { id: 1, name: "Sprint 23 UAT", project: "Mobile App v2.0", status: "In Progress", progress: 65, startDate: "2024-02-20", testCases: 45, passed: 29, failed: 0, pending: 16 },
    { id: 2, name: "Payment Integration Test", project: "Payment Gateway", status: "Completed", progress: 100, startDate: "2024-02-18", testCases: 32, passed: 30, failed: 2, pending: 0 },
    { id: 3, name: "Regression Suite", project: "E-commerce Platform", status: "Planned", progress: 0, startDate: "2024-02-25", testCases: 89, passed: 0, failed: 0, pending: 89 },
  ]);

  const columns = [
    {
      header: "Run Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <PlayCircle size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.name}</p>
            <p className="text-xs text-zinc-500">{row.project}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
          row.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
          'bg-zinc-100 text-zinc-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Progress",
      accessor: "progress",
      cell: (row) => (
        <div className="w-full max-w-[120px]">
          <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
            <span>{row.progress}%</span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div className="bg-[var(--primary)] h-2 rounded-full transition-all" style={{ width: `${row.progress}%` }}></div>
          </div>
        </div>
      ),
    },
    {
      header: "Results",
      accessor: "results",
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-600 font-semibold">✓ {row.passed}</span>
          <span className="text-red-600 font-semibold">✗ {row.failed}</span>
          <span className="text-zinc-500">⏳ {row.pending}</span>
        </div>
      ),
    },
    {
      header: "Start Date",
      accessor: "startDate",
      cell: (row) => <span className="text-sm text-zinc-600">{new Date(row.startDate).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Test Runs</h1>
          <p className="text-sm text-zinc-600 mt-1">Execute and track test run progress</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20">
          <Plus size={16} /> New Test Run
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
