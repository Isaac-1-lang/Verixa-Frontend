"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import DataTable from "../../components/common/DataTable";

export default function ExecutionsPage() {
  const [executions] = useState([
    { id: 1, testCase: "TC-001: User Login", run: "Sprint 23 UAT", result: "Passed", executedBy: "John Doe", executedAt: "2024-02-20 10:30", duration: "2m 15s" },
    { id: 2, testCase: "TC-002: Password Reset", run: "Sprint 23 UAT", result: "Passed", executedBy: "Jane Smith", executedAt: "2024-02-20 11:00", duration: "3m 45s" },
    { id: 3, testCase: "TC-003: Payment Processing", run: "Payment Integration Test", result: "Failed", executedBy: "Mike Johnson", executedAt: "2024-02-19 14:20", duration: "5m 30s" },
    { id: 4, testCase: "TC-004: User Registration", run: "Sprint 23 UAT", result: "Pending", executedBy: "-", executedAt: "-", duration: "-" },
  ]);

  const columns = [
    {
      header: "Test Unit",
      accessor: "testCase",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-navy text-sm group-hover:translate-x-1 transition-transform duration-300">{row.testCase}</p>
          <p className="text-xs text-navy/40 font-medium">{row.run}</p>
        </div>
      ),
    },
    {
      header: "Result",
      accessor: "result",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border border-navy/5 bg-navy/5 ${row.result === 'Passed' ? 'text-emerald' :
            row.result === 'Failed' ? 'text-navy' :
              'text-navy/20'
            }`}>
            {row.result === 'Passed' && <CheckCircle size={14} strokeWidth={2.5} />}
            {row.result === 'Failed' && <XCircle size={14} strokeWidth={2.5} />}
            {row.result === 'Pending' && <Clock size={14} strokeWidth={2.5} />}
          </div>
          <span className={`text-xs font-bold ${row.result === 'Passed' ? 'text-emerald' :
            row.result === 'Failed' ? 'text-navy' :
              'text-navy/20'
            }`}>
            {row.result === 'Passed' ? 'Passed' : row.result === 'Failed' ? 'Failed' : 'Pending'}
          </span>
        </div>
      ),
    },
    {
      header: "Operator",
      accessor: "executedBy",
      cell: (row) => <span className="text-sm font-bold text-navy/50">{row.executedBy}</span>,
    },
    {
      header: "Timestamp",
      accessor: "executedAt",
      cell: (row) => <span className="text-xs font-bold text-navy/30">{row.executedAt}</span>,
    },
    {
      header: "Duration",
      accessor: "duration",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Clock size={10} className="text-navy/20" />
          <span className="text-xs font-bold text-navy/30">{row.duration}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Execution Logs</h1>
          <p className="text-navy/40 text-sm font-medium">Historical trace of all quality assurance streams</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={executions}
        searchPlaceholder="Search executions..."
        onRowClick={(row) => console.log('Clicked:', row)}
        emptyMessage="No executions found."
      />
    </div>
  );
}
