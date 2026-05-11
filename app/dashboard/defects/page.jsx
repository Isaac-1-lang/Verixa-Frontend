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
      header: "Defect Details",
      accessor: "title",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className={`p-3 rounded-md border border-navy/5 bg-navy/5 ${row.severity === 'Critical' ? 'text-navy' :
            row.severity === 'High' ? 'text-navy/60' :
              'text-navy/20'
            }`}>
            <AlertCircle size={18} strokeWidth={row.severity === 'Critical' ? 2.5 : 1.5} className={row.severity === 'Critical' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="font-bold text-navy text-sm group-hover:translate-x-1 transition-transform duration-300">{row.title}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">Vector: {row.execution}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Severity",
      accessor: "severity",
      cell: (row) => (
        <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${row.severity === 'Critical' ? 'bg-navy text-white border-navy shadow-sm' :
          row.severity === 'High' ? 'bg-navy/5 text-navy border-navy/10' :
            'bg-offwhite text-navy/40 border-navy/5'
          }`}>
          {row.severity}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-md ${row.status === 'Open' ? 'bg-navy animate-pulse' : row.status === 'In Progress' ? 'bg-navy/40' : 'bg-navy/10'}`} />
          <span className={`text-xs font-bold ${row.status === 'Open' ? 'text-navy' : 'text-navy/20'}`}>
            {row.status}
          </span>
        </div>
      ),
    },
    {
      header: "Reporter",
      accessor: "reportedBy",
      cell: (row) => <span className="text-sm font-bold text-navy/40">{row.reportedBy}</span>,
    },
    {
      header: "Log Date",
      accessor: "reportedAt",
      cell: (row) => <span className="text-xs font-bold text-navy/20">{row.reportedAt}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Defects</h1>
          <p className="text-navy/40 text-sm font-medium">Critical vulnerabilities and resolution streams</p>
        </div>
        <button className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
          <Plus size={20} strokeWidth={2.5} /> Log New Defect
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
