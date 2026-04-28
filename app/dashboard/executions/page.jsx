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
      header: "Test Case",
      accessor: "testCase",
      cell: (row) => (
        <div>
          <p className="font-semibold text-zinc-900 text-sm">{row.testCase}</p>
          <p className="text-xs text-zinc-500">{row.run}</p>
        </div>
      ),
    },
    {
      header: "Result",
      accessor: "result",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.result === 'Passed' && <CheckCircle size={16} className="text-emerald-600" />}
          {row.result === 'Failed' && <XCircle size={16} className="text-red-600" />}
          {row.result === 'Pending' && <Clock size={16} className="text-amber-600" />}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
            row.result === 'Passed' ? 'bg-emerald-50 text-emerald-700' :
            row.result === 'Failed' ? 'bg-red-50 text-red-700' :
            'bg-amber-50 text-amber-700'
          }`}>
            {row.result}
          </span>
        </div>
      ),
    },
    {
      header: "Executed By",
      accessor: "executedBy",
      cell: (row) => <span className="text-sm text-zinc-700">{row.executedBy}</span>,
    },
    {
      header: "Executed At",
      accessor: "executedAt",
      cell: (row) => <span className="text-sm text-zinc-600">{row.executedAt}</span>,
    },
    {
      header: "Duration",
      accessor: "duration",
      cell: (row) => <span className="text-sm text-zinc-600">{row.duration}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Test Executions</h1>
          <p className="text-sm text-zinc-600 mt-1">View and manage test execution results</p>
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
