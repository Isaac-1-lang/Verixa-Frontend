"use client";
import { useState } from "react";
import { Plus, PlayCircle } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import TestRunModal from "../../components/runs/TestRunModal";
import { useListTestRunsByProjectQuery } from "@/app/redux/api/TestRunApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function RunsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { selectedProjectId, selectRun } = useProject();

  // Use list endpoint instead of paginated search for simpler data fetching
  const { data: runsData = [], isLoading, error } = useListTestRunsByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId
  });

  // Filter out null/undefined items
  const runs = Array.isArray(runsData) ? runsData.filter(item => item != null) : [];

  const handleRowClick = (row) => {
    // Select this run as the active run
    selectRun(row.id);
  };

  const columns = [
    {
      header: "Run Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <PlayCircle size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.name}</p>
            <p className="text-xs text-zinc-500">{row.environment}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
          row.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
          row.status === 'PLANNED' ? 'bg-slate-50 text-slate-700' :
          'bg-zinc-100 text-zinc-700'
        }`}>
          {row.status?.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => <span className="text-sm text-zinc-600">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Test Runs</h1>
          <p className="text-sm text-zinc-600 mt-1">Execute and track test run progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedProjectId}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> New Test Run
        </button>
      </div>

      {!selectedProjectId ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-600">Please select a project from the top bar to view test runs.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading test runs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading test runs: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={runs}
          searchPlaceholder="Search test runs..."
          onRowClick={handleRowClick}
          emptyMessage="No test runs found. Create your first test run to get started."
        />
      )}

      {selectedProjectId && (
        <TestRunModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={selectedProjectId}
        />
      )}
    </div>
  );
}
