"use client";
import { useState } from "react";
import { Plus, Folder, Calendar, User } from "lucide-react";
import DataTable from "../../components/common/DataTable";

export default function ProjectsPage() {
  const [projects] = useState([
    { id: 1, name: "Mobile App v2.0", description: "iOS and Android app testing", createdAt: "2024-01-15", owner: "John Doe", testCases: 45, runs: 8 },
    { id: 2, name: "Payment Gateway", description: "Payment integration UAT", createdAt: "2024-01-20", owner: "Jane Smith", testCases: 32, runs: 5 },
    { id: 3, name: "Admin Dashboard", description: "Backend admin panel", createdAt: "2024-02-01", owner: "Mike Johnson", testCases: 28, runs: 3 },
    { id: 4, name: "API Integration", description: "Third-party API testing", createdAt: "2024-02-10", owner: "Sarah Williams", testCases: 56, runs: 12 },
    { id: 5, name: "E-commerce Platform", description: "Full stack e-commerce", createdAt: "2024-02-15", owner: "David Brown", testCases: 89, runs: 15 },
  ]);

  const columns = [
    {
      header: "Project Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
            <Folder size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.name}</p>
            <p className="text-xs text-zinc-500">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      accessor: "owner",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-zinc-400" />
          <span>{row.owner}</span>
        </div>
      ),
    },
    {
      header: "Test Cases",
      accessor: "testCases",
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
          {row.testCases} cases
        </span>
      ),
    },
    {
      header: "Runs",
      accessor: "runs",
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold">
          {row.runs} runs
        </span>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-600">
          <Calendar size={14} className="text-zinc-400" />
          <span className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage your UAT projects and test suites</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20">
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Search projects..."
        onRowClick={(row) => console.log('Clicked:', row)}
        emptyMessage="No projects found. Create your first project to get started."
      />
    </div>
  );
}
