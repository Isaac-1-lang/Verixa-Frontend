"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ExecutionModal from "../../components/executions/ExecutionModal";
import { useSearchExecutionsQuery } from "@/app/redux/api/ExecutionApiSlice";

export default function ExecutionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [page, setPage] = useState(0);
  const [resultFilter, setResultFilter] = useState("");
  
  // TODO: Get runId from context or route params
  const runId = 1;

  const { data, isLoading, error } = useSearchExecutionsQuery({
    runId,
    result: resultFilter || undefined,
    page,
    size: 20
  }, {
    skip: !runId
  });

  const executions = data?.content || [];

  const columns = [
    {
      header: "Test Case",
      accessor: "testCase",
      cell: (row) => (
        <div>
          <p className="font-semibold text-zinc-900 text-sm">{row.testCase?.tcNumber || "-"}</p>
          <p className="text-xs text-zinc-500">{row.testCase?.title || "-"}</p>
        </div>
      ),
    },
    {
      header: "Result",
      accessor: "result",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.result === 'PASSED' && <CheckCircle size={16} className="text-emerald-600" />}
          {row.result === 'FAILED' && <XCircle size={16} className="text-red-600" />}
          {row.result === 'NOT_EXECUTED' && <Clock size={16} className="text-amber-600" />}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
            row.result === 'PASSED' ? 'bg-emerald-50 text-emerald-700' :
            row.result === 'FAILED' ? 'bg-red-50 text-red-700' :
            row.result === 'BLOCKED' ? 'bg-orange-50 text-orange-700' :
            row.result === 'SKIPPED' ? 'bg-slate-50 text-slate-700' :
            'bg-amber-50 text-amber-700'
          }`}>
            {row.result?.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
      cell: (row) => <span className="text-sm text-zinc-700">{row.assignedTo?.username || "-"}</span>,
    },
    {
      header: "Executed At",
      accessor: "executedAt",
      cell: (row) => <span className="text-sm text-zinc-600">{row.executedAt ? new Date(row.executedAt).toLocaleString() : "-"}</span>,
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

      {!runId ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Please select a test run to view executions.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading executions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading executions: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={executions}
          searchPlaceholder="Search executions..."
          onRowClick={(row) => {
            setSelectedExecution(row);
            setIsModalOpen(true);
          }}
          emptyMessage="No executions found."
        />
      )}

      {selectedExecution && (
        <ExecutionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExecution(null);
          }}
          execution={selectedExecution}
          runId={runId}
          testCaseId={selectedExecution.testCase?.id}
        />
      )}
    </div>
  );
}
