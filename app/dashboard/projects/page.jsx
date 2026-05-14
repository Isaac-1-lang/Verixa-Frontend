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
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <Folder size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-base">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
<<<<<<< HEAD
      header: "Created By",
      accessor: "createdBy",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-navy/5 flex items-center justify-center border border-navy/5">
            <User size={12} className="text-navy/30" />
          </div>
          <span className="text-sm font-bold text-navy/60">{row.createdBy || "-"}</span>
        </div>
      ),
    },
    {
=======
>>>>>>> Integration
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <div className="flex items-center gap-3 text-navy/30 group-hover:text-navy/60 transition-colors">
          <Calendar size={14} strokeWidth={1.5} />
          <span className="text-xs font-bold">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>
        </div>
      ),
    },
  ];

  return (
<<<<<<< HEAD
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Projects</h1>
          <p className="text-navy/40 text-sm font-medium">Manage and monitor your software quality initiatives by Project ID</p>
=======
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage all your projects</p>
>>>>>>> Integration
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all"
        >
          <Plus size={20} strokeWidth={2.5} /> Create New Project
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
