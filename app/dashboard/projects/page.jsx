"use client";
import { useState } from "react";
import { Plus, Folder, Calendar } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ProjectModal from "../../components/projects/ProjectModal";
import { useListAllProjectsQuery } from "@/app/redux/api/ProjectsApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectProject } = useProject();

  const { data: projects = [], isLoading, error } = useListAllProjectsQuery();

  const handleRowClick = (row) => {
    selectProject(row.id);
  };

  const columns = [
    {
      header: "Project ID",
      accessor: "id",
      cell: (row) => (
        <span className="text-zinc-600 font-mono text-sm">#{row.id}</span>
      ),
    },
    {
      header: "Project Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
            <Folder size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-600">
          <Calendar size={14} className="text-zinc-400" />
          <span className="text-sm">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage all your projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading projects</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          searchPlaceholder="Search projects..."
          onRowClick={handleRowClick}
          emptyMessage="No projects found. Create your first project to get started."
        />
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
