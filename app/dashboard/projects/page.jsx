"use client";

import { useState } from "react";
import { Plus, Folder, Calendar, User, Search } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ProjectModal from "../../components/projects/ProjectModal";
import { useGetProjectByIdQuery } from "@/app/redux/api/ProjectsApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId] = useState("");
  const { selectProject } = useProject();

  const { data: project, isLoading, error } = useGetProjectByIdQuery(searchId, {
    skip: !searchId,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchId(searchInput.trim());
    }
  };

  const handleRowClick = (row) => {
    // Select this project as the active project
    selectProject(row.id);
  };

  const projects = project ? [project] : [];

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
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy leading-tight mb-1">Projects</h1>
          <p className="text-navy/40 text-xs font-medium">Manage and monitor your software quality initiatives by Project ID</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-md font-bold text-xs shadow-lg shadow-navy/10 hover:translate-y-[-1px] transition-all"
        >
          <Plus size={16} strokeWidth={2.5} /> Create New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search project by ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
            />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading project...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading project: {error.data?.message || error.status === 404 ? "Project not found" : "Unknown error"}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          searchPlaceholder="Filter result..."
          onRowClick={handleRowClick}
          emptyMessage={searchId ? "No project found with this ID." : "Enter a Project ID to search for a project."}
        />
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(id) => {
          setSearchId(id);
          setSearchInput(id);
        }}
      />
    </div>
  );
}
