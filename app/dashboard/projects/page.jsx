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
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <Folder size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-base">{row.name}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      accessor: "owner",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-navy/5 flex items-center justify-center border border-navy/5">
            <User size={12} className="text-navy/30" />
          </div>
          <span className="text-sm font-bold text-navy/60">{row.owner}</span>
        </div>
      ),
    },
    {
      header: "Metrics",
      accessor: "metrics",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-md bg-navy/5 border border-navy/5 text-xs font-bold text-navy/60">
            {row.testCases} Cases
          </span>
          <span className="px-3 py-1.5 rounded-md bg-navy/5 border border-navy/5 text-xs font-bold text-navy/60">
            {row.runs} Runs
          </span>
        </div>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <div className="flex items-center gap-3 text-navy/30 group-hover:text-navy/60 transition-colors">
          <Calendar size={14} strokeWidth={1.5} />
          <span className="text-xs font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Projects</h1>
          <p className="text-navy/40 text-sm font-medium">Manage and monitor your software quality initiatives</p>
        </div>
        <button className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
          <Plus size={20} strokeWidth={2.5} /> Create New Project
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
