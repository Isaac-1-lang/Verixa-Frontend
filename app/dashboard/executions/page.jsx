"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ExecutionModal from "../../components/executions/ExecutionModal";
import { useSearchExecutionsQuery } from "@/app/redux/api/ExecutionApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function ExecutionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [page, setPage] = useState(0);
  const [resultFilter, setResultFilter] = useState("");
  
  const { selectedRunId } = useProject();

  const { data, isLoading, error } = useSearchExecutionsQuery({
    runId: selectedRunId,
    result: resultFilter || undefined,
    page,
    size: 20
  }, {
    skip: !selectedRunId
  });

  const executions = data?.content || [];

  const columns = [
    {
      header: "Test Unit",
      accessor: "testCase",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-navy text-sm group-hover:translate-x-1 transition-transform duration-300">
            {row.testCase?.tcNumber || "-"}
          </p>
          <p className="text-xs text-navy/40 font-medium">{row.testCase?.title || "-"}</p>
        </div>
      ),
    },
    {
      header: "Result",
      accessor: "result",
      cell: (row) => {
        const isPassed = row.result === 'PASSED' || row.result === 'Passed';
        const isFailed = row.result === 'FAILED' || row.result === 'Failed';
        const isPending = row.result === 'NOT_EXECUTED' || row.result === 'Pending';
        
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border border-navy/5 bg-navy/5 ${
              isPassed ? 'text-emerald-600' : isFailed ? 'text-red-600' : 'text-amber-500'
            }`}>
              {isPassed && <CheckCircle size={14} strokeWidth={2.5} />}
              {isFailed && <XCircle size={14} strokeWidth={2.5} />}
              {isPending && <Clock size={14} strokeWidth={2.5} />}
            </div>
            <span className={`text-xs font-bold ${
              isPassed ? 'text-emerald-600' : isFailed ? 'text-red-600' : 'text-amber-500'
            }`}>
              {row.result?.replace('_', ' ')}
            </span>
          </div>
        );
      },
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
      cell: (row) => (
        <span className="text-sm font-bold text-navy/50">
          {row.assignedTo?.username || "-"}
        </span>
      ),
    },
    {
      header: "Timestamp",
      accessor: "executedAt",
      cell: (row) => (
        <span className="text-xs font-bold text-navy/30">
          {row.executedAt ? new Date(row.executedAt).toLocaleString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy leading-tight mb-1">Execution Logs</h1>
          <p className="text-navy/40 text-xs font-medium">Historical trace of all quality assurance streams</p>
        </div>
      </div>

      {!selectedRunId ? (
        <div className="text-center py-12 bg-white/80 rounded-xl border border-zinc-200">
          <p className="text-zinc-600">Please select a test run from the Runs page to view executions.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading executions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading executions: {error.data?.message || "Unknown error"}</p>
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
          runId={selectedRunId}
          testCaseId={selectedExecution.testCase?.id}
        />
      )}
    </div>
  );
}
