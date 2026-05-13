"use client";
import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import DefectModal from "../../components/defects/DefectModal";
import { useGetDefectsByRunQuery, useUpdateDefectStatusMutation } from "@/app/redux/api/DefectApiSlice";
import { useProject } from "@/app/context/ProjectContext";
import toast from "react-hot-toast";

export default function DefectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  
  const { selectedRunId } = useProject();

  const { data: defects = [], isLoading, error } = useGetDefectsByRunQuery(selectedRunId, {
    skip: !selectedRunId
  });

  const [updateDefectStatus] = useUpdateDefectStatusMutation();

  const columns = [
    {
      header: "Defect",
      accessor: "title",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            row.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' :
            row.severity === 'HIGH' ? 'bg-orange-50 text-orange-600' :
            row.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
            'bg-slate-50 text-slate-700'
          }`}>
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.title}</p>
            <p className="text-xs text-zinc-500">Execution #{row.executionId}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Severity",
      accessor: "severity",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.severity === 'CRITICAL' ? 'bg-red-50 text-red-700' :
          row.severity === 'HIGH' ? 'bg-orange-50 text-orange-700' :
          row.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
          'bg-slate-50 text-slate-700'
        }`}>
          {row.severity}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.status === 'OPEN' ? 'bg-blue-50 text-blue-700' :
          row.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700' :
          row.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
          row.status === 'CLOSED' ? 'bg-slate-50 text-slate-700' :
          'bg-orange-50 text-orange-700'
        }`}>
          {row.status?.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: "Reported By",
      accessor: "reportedBy",
      cell: (row) => <span className="text-sm text-zinc-700">{row.reportedBy?.username || "-"}</span>,
    },
    {
      header: "Reported At",
      accessor: "createdAt",
      cell: (row) => <span className="text-sm text-zinc-600">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Defects</h1>
          <p className="text-sm text-zinc-600 mt-1">Track and manage defects found during testing</p>
        </div>
        <button 
          onClick={() => {
            // For now, open modal with a placeholder executionId
            // In real scenario, this would come from execution selection
            setSelectedExecutionId(1);
            setIsModalOpen(true);
          }}
          disabled={!selectedRunId}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Log Defect
        </button>
      </div>

      {!selectedRunId ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-600">Please select a test run from the Runs page to view defects.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading defects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading defects: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={defects}
          searchPlaceholder="Search defects..."
          onRowClick={(row) => console.log('Clicked:', row)}
          emptyMessage="No defects found."
        />
      )}

      {selectedExecutionId && (
        <DefectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExecutionId(null);
          }}
          executionId={selectedExecutionId}
        />
      )}
    </div>
  );
}
