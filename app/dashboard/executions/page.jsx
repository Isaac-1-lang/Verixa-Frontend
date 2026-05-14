"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, PlayCircle } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ExecutionModal from "../../components/executions/ExecutionModal";
import { useGetExecutionsByRunQuery } from "@/app/redux/api/ExecutionApiSlice";
import { useProject } from "@/app/context/ProjectContext";

const resultBadge = (result) => {
  const map = {
    PASSED: "bg-emerald-50 text-emerald-700",
    FAILED: "bg-red-50 text-red-700",
    BLOCKED: "bg-orange-50 text-orange-700",
    PARTIALLY_PASSED: "bg-yellow-50 text-yellow-700",
    FEATURE_NOT_AVAILABLE: "bg-slate-50 text-slate-700",
    NOT_RUN: "bg-amber-50 text-amber-700",
  };
  return map[result] || "bg-zinc-100 text-zinc-700";
};

export default function ExecutionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);

  const { selectedRunId } = useProject();

  const { data: executionsData = [], isLoading, error, refetch } = useGetExecutionsByRunQuery(selectedRunId, {
    skip: !selectedRunId
  });

  const executions = Array.isArray(executionsData) ? executionsData.filter(item => item != null) : [];

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
<<<<<<< HEAD
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
=======
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.result === "PASSED" && <CheckCircle size={15} className="text-emerald-600" />}
          {row.result === "FAILED" && <XCircle size={15} className="text-red-600" />}
          {row.result === "NOT_RUN" && <Clock size={15} className="text-amber-600" />}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${resultBadge(row.result)}`}>
            {row.result?.replace(/_/g, " ")}
          </span>
        </div>
      ),
>>>>>>> Integration
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
<<<<<<< HEAD
      cell: (row) => (
        <span className="text-sm font-bold text-navy/50">
          {row.assignedTo?.username || "-"}
        </span>
      ),
=======
      cell: (row) => <span className="text-sm text-zinc-700">{row.assignedTo || "-"}</span>,
    },
    {
      header: "Executed By",
      accessor: "executedBy",
      cell: (row) => <span className="text-sm text-zinc-700">{row.executedBy || "-"}</span>,
>>>>>>> Integration
    },
    {
      header: "Timestamp",
      accessor: "executedAt",
      cell: (row) => (
<<<<<<< HEAD
        <span className="text-xs font-bold text-navy/30">
          {row.executedAt ? new Date(row.executedAt).toLocaleString() : "-"}
        </span>
      ),
=======
        <span className="text-sm text-zinc-600">
          {row.executedAt ? new Date(row.executedAt).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "assignmentStatus",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.assignmentStatus === "DONE" ? "bg-emerald-50 text-emerald-700" :
          row.assignmentStatus === "ASSIGNED" ? "bg-blue-50 text-blue-700" :
          row.assignmentStatus === "CLAIMED" ? "bg-purple-50 text-purple-700" :
          "bg-zinc-100 text-zinc-600"
        }`}>
          {row.assignmentStatus?.replace(/_/g, " ")}
        </span>
      ),
>>>>>>> Integration
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

      {!selectedRunId ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <PlayCircle className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-900 font-semibold mb-2">No Test Run Selected</p>
          <p className="text-zinc-500 text-sm">Select a test run from the top bar to view executions.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-16">
          <p className="text-zinc-600">Loading executions...</p>
        </div>
      ) : error ? (
<<<<<<< HEAD
        <div className="text-center py-12">
          <p className="text-red-600">Error loading executions: {error.data?.message || "Unknown error"}</p>
=======
        <div className="text-center py-16">
          <p className="text-red-600">Error loading executions.</p>
>>>>>>> Integration
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
          emptyMessage="No executions found for this run."
        />
      )}

      {selectedExecution && (
        <ExecutionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExecution(null);
            refetch();
          }}
          execution={selectedExecution}
          runId={selectedRunId}
          testCaseId={selectedExecution.testCaseId}
        />
      )}
    </div>
  );
}
