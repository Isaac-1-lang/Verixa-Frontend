"use client";
import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import DataTable from "../../components/common/DataTable";

export default function DefectsPage() {
  const [defects] = useState([
    { id: 1, title: "Payment Gateway Timeout", severity: "Critical", status: "Open", execution: "TC-003", reportedBy: "Mike Johnson", reportedAt: "2024-02-19 14:25" },
    { id: 2, title: "UI Alignment Issue on Mobile", severity: "Low", status: "In Progress", execution: "TC-001", reportedBy: "John Doe", reportedAt: "2024-02-20 10:35" },
    { id: 3, title: "Incorrect Error Message", severity: "Medium", status: "Resolved", execution: "TC-002", reportedBy: "Jane Smith", reportedAt: "2024-02-18 15:10" },
    { id: 4, title: "Data Validation Missing", severity: "High", status: "Open", execution: "TC-004", reportedBy: "Sarah Williams", reportedAt: "2024-02-20 09:15" },
  ]);

  const columns = [
    {
      header: "Defect",
      accessor: "title",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            row.severity === 'Critical' ? 'bg-red-50 text-red-600' :
            row.severity === 'High' ? 'bg-orange-50 text-orange-600' :
            row.severity === 'Medium' ? 'bg-amber-50 text-amber-600' :
            'bg-blue-50 text-blue-600'
          }`}>
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.title}</p>
            <p className="text-xs text-zinc-500">Execution: {row.execution}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Severity",
      accessor: "severity",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.severity === 'Critical' ? 'bg-red-50 text-red-700' :
          row.severity === 'High' ? 'bg-orange-50 text-orange-700' :
          row.severity === 'Medium' ? 'bg-amber-50 text-amber-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {row.severity}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
          row.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
          'bg-zinc-100 text-zinc-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Reported By",
      accessor: "reportedBy",
      cell: (row) => <span className="text-sm text-zinc-700">{row.reportedBy}</span>,
    },
    {
      header: "Reported At",
      accessor: "reportedAt",
      cell: (row) => <span className="text-sm text-zinc-600">{row.reportedAt}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Defects</h1>
          <p className="text-sm text-zinc-600 mt-1">Track and manage defects found during testing</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20">
          <Plus size={16} /> Log Defect
        </button>
      </div>

      <DataTable
        columns={columns}
        data={defects}
        searchPlaceholder="Search defects..."
        onRowClick={(row) => console.log('Clicked:', row)}
        emptyMessage="No defects found."
      />
    </div>
  );
}
