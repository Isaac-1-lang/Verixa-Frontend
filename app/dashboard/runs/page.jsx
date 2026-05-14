"use client";

import { useState } from "react";
import { Plus, PlayCircle, Calendar } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import TestRunModal from "../../components/runs/TestRunModal";
import { useListTestRunsByProjectQuery } from "@/app/redux/api/TestRunApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function RunsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { selectedProjectId, selectRun } = useProject();

<<<<<<< HEAD
  const { data: runs = [], isLoading, error } = useListTestRunsByProjectQuery(selectedProjectId, {
=======
  // Use list endpoint instead of paginated search for simpler data fetching
  const { data: runsData = [], isLoading, error } = useListTestRunsByProjectQuery(selectedProjectId, {
>>>>>>> Integration
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
      header: "Operation Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <PlayCircle size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-sm">{row.name}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">{row.environment || "Default Env"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const isInProgress = row.status === 'IN_PROGRESS' || row.status === 'In Progress';
        const isCompleted = row.status === 'COMPLETED' || row.status === 'Completed';
        
        return (
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-md ${
              isInProgress ? 'bg-navy animate-pulse' : 
              isCompleted ? 'bg-emerald-500' : 'bg-navy/10'
            }`} />
            <span className={`text-xs font-bold ${
              isInProgress ? 'text-navy' : isCompleted ? 'text-emerald-600' : 'text-navy/20'
            }`}>
              {row.status?.replace('_', ' ')}
            </span>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <div className="flex items-center gap-2 text-navy/30 group-hover:text-navy/60 transition-colors">
          <Calendar size={14} strokeWidth={1.5} />
          <span className="text-xs font-bold">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Test Runs</h1>
          <p className="text-navy/40 text-sm font-medium">Active execution streams and progress monitoring</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedProjectId}
          className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} strokeWidth={2.5} /> Initialize Test Run
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
          <p className="text-red-600">Error loading test runs: {error.data?.message || "Unknown error"}</p>
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
