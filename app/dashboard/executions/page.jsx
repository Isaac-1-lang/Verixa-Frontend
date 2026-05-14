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
          {row.result === "PASSED" && <CheckCircle size={15} className="text-emerald-600" />}
          {row.result === "FAILED" && <XCircle size={15} className="text-red-600" />}
          {row.result === "NOT_RUN" && <Clock size={15} className="text-amber-600" />}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${resultBadge(row.result)}`}>
            {row.result?.replace(/_/g, " ")}
          </span>
        </div>
      ),
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
      cell: (row) => <span className="text-sm text-zinc-700">{row.assignedTo || "-"}</span>,
    },
    {
      header: "Executed By",
      accessor: "executedBy",
      cell: (row) => <span className="text-sm text-zinc-700">{row.executedBy || "-"}</span>,
    },
    {
      header: "Executed At",
      accessor: "executedAt",
      cell: (row) => (
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
        <div className="text-center py-16">
          <p className="text-red-600">Error loading executions.</p>
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
