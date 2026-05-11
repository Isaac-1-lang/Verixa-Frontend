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
      header: "Test Unit",
      accessor: "tcNumber",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <FileText size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-sm">{row.tcNumber}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Project",
      accessor: "project",
      cell: (row) => <span className="text-sm font-bold text-navy/50">{row.project}</span>,
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (row) => (
        <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${row.priority === 'Critical' ? 'bg-navy text-white border-navy shadow-sm' :
          row.priority === 'High' ? 'bg-navy/5 text-navy border-navy/10' :
            'bg-offwhite text-navy/40 border-navy/5'
          }`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-md ${row.status === 'Active' ? 'bg-navy animate-pulse' : 'bg-navy/10'}`} />
          <span className={`text-xs font-bold ${row.status === 'Active' ? 'text-navy' : 'text-navy/20'}`}>
            {row.status}
          </span>
        </div>
      ),
    },
    {
      header: "Steps",
      accessor: "steps",
      cell: (row) => <span className="text-xs font-bold text-navy/40">{row.steps} Steps</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Test Cases</h1>
          <p className="text-navy/40 text-sm font-medium">Defined structural quality benchmarks</p>
        </div>
        <button className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all">
          <Plus size={20} strokeWidth={2.5} /> Create Test Case
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
