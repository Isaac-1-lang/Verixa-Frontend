"use client";
import { useState } from "react";
import { Users, CheckCircle, Clock } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import { useGetQueueByRunQuery, useClaimNextExecutionMutation, useReleaseExecutionMutation } from "@/app/redux/api/QueueApiSlice";
import toast from "react-hot-toast";

export default function QueuePage() {
  const [page, setPage] = useState(0);
  
  // TODO: Get runId from context or route params
  const runId = 1;

  const { data, isLoading, error } = useGetQueueByRunQuery({
    runId,
    page,
    size: 50
  }, {
    skip: !runId
  });

  const [claimNext, { isLoading: isClaiming }] = useClaimNextExecutionMutation();
  const [releaseExecution, { isLoading: isReleasing }] = useReleaseExecutionMutation();

  const executions = data?.content || [];

  const handleClaimNext = async () => {
    try {
      await claimNext(runId).unwrap();
      toast.success("Execution claimed successfully");
    } catch (error) {
      console.error("Error claiming execution:", error);
      toast.error(error.data?.message || "Failed to claim execution");
    }
  };

  const handleRelease = async (executionId) => {
    try {
      await releaseExecution(executionId).unwrap();
      toast.success("Execution released successfully");
    } catch (error) {
      console.error("Error releasing execution:", error);
      toast.error(error.data?.message || "Failed to release execution");
    }
  };

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
      header: "Assignment Status",
      accessor: "assignmentStatus",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.assignmentStatus === 'ASSIGNED' ? 'bg-blue-50 text-blue-700' :
          row.assignmentStatus === 'CLAIMED' ? 'bg-emerald-50 text-emerald-700' :
          'bg-slate-50 text-slate-700'
        }`}>
          {row.assignmentStatus?.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: "Assigned To",
      accessor: "assignedTo",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-zinc-400" />
          <span className="text-sm text-zinc-700">{row.assignedTo?.username || "Unassigned"}</span>
        </div>
      ),
    },
    {
      header: "Result",
      accessor: "result",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.result === 'PASSED' && <CheckCircle size={16} className="text-emerald-600" />}
          {row.result === 'NOT_EXECUTED' && <Clock size={16} className="text-amber-600" />}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
            row.result === 'PASSED' ? 'bg-emerald-50 text-emerald-700' :
            row.result === 'FAILED' ? 'bg-red-50 text-red-700' :
            'bg-amber-50 text-amber-700'
          }`}>
            {row.result?.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.assignmentStatus === 'ASSIGNED' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRelease(row.id);
              }}
              disabled={isReleasing}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              Release
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Execution Queue</h1>
          <p className="text-sm text-zinc-600 mt-1">Claim and manage test execution assignments</p>
        </div>
        <button 
          onClick={handleClaimNext}
          disabled={isClaiming}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50"
        >
          <CheckCircle size={16} /> Claim Next
        </button>
      </div>

      {!runId ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Please select a test run to view the execution queue.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading queue...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading queue: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={executions}
          searchPlaceholder="Search queue..."
          onRowClick={(row) => console.log('Clicked:', row)}
          emptyMessage="No executions in queue."
        />
      )}
    </div>
  );
}
