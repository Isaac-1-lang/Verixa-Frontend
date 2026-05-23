"use client";
import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import RequirementModal from "../../components/requirements/RequirementModal";
import { useGetRequirementsByProjectQuery } from "@/app/redux/api/RequirementApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function RequirementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  
  const { selectedProjectId } = useProject();

  const { data: requirementsData = [], isLoading, error } = useGetRequirementsByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId
  });

  // Filter out null/undefined items
  const requirements = Array.isArray(requirementsData) ? requirementsData.filter(item => item != null) : [];

  const columns = [
    {
      header: "Requirement",
      accessor: "frRefCode",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.frRefCode}</p>
            <p className="text-xs text-zinc-500 line-clamp-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "App Reference",
      accessor: "appRef",
      cell: (row) => <span className="text-sm text-zinc-700">{row.appRef || "-"}</span>,
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
          row.priority === 'CRITICAL' ? 'bg-red-50 text-red-700' :
          row.priority === 'HIGH' ? 'bg-orange-50 text-orange-700' :
          row.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
          'bg-slate-50 text-slate-700'
        }`}>
          {row.priority}
        </span>
      ),
    },
  ];

  const handleRowClick = (row) => {
    setSelectedRequirement(row);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedRequirement(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequirement(null);
  };

  if (!selectedProjectId) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-600">Please select a project from the top bar to view requirements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Requirements</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage functional requirements for your project</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> New Requirement
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading requirements...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading requirements: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requirements}
          searchPlaceholder="Search requirements..."
          onRowClick={handleRowClick}
          emptyMessage="No requirements found. Create your first requirement to get started."
        />
      )}

      <RequirementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        projectId={selectedProjectId}
        requirement={selectedRequirement}
      />
    </div>
  );
}
