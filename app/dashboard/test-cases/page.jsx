"use client";
import { useState } from "react";
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import DataTable from "../../components/common/DataTable";

export default function TestCasesPage() {
  const [testCases] = useState([
    { id: 1, tcNumber: "TC-001", title: "User Login with Valid Credentials", project: "Mobile App v2.0", priority: "High", status: "Active", steps: 5 },
    { id: 2, tcNumber: "TC-002", title: "Password Reset Flow", project: "Mobile App v2.0", priority: "Medium", status: "Active", steps: 7 },
    { id: 3, tcNumber: "TC-003", title: "Payment Processing", project: "Payment Gateway", priority: "Critical", status: "Active", steps: 12 },
    { id: 4, tcNumber: "TC-004", title: "User Registration", project: "Mobile App v2.0", priority: "High", status: "Active", steps: 8 },
    { id: 5, tcNumber: "TC-005", title: "Product Search", project: "E-commerce Platform", priority: "Medium", status: "Draft", steps: 6 },
  ]);

  const columns = [
    {
      header: "Test Case",
      accessor: "tcNumber",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.tcNumber}</p>
            <p className="text-xs text-zinc-500">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Project",
      accessor: "project",
      cell: (row) => <span className="text-sm text-zinc-700">{row.project}</span>,
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.priority === 'Critical' ? 'bg-red-50 text-red-700' :
          row.priority === 'High' ? 'bg-orange-50 text-orange-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Steps",
      accessor: "steps",
      cell: (row) => <span className="text-sm text-zinc-600">{row.steps} steps</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Test Cases</h1>
          <p className="text-sm text-zinc-600 mt-1">Create and manage test cases with detailed steps</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20">
          <Plus size={16} /> New Test Case
        </button>
      </div>

      <DataTable
        columns={columns}
        data={testCases}
        searchPlaceholder="Search test cases..."
        onRowClick={(row) => console.log('Clicked:', row)}
        emptyMessage="No test cases found. Create your first test case to get started."
      />
    </div>
  );
}
