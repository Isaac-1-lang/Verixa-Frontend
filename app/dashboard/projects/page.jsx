"use client";
import { useState } from "react";
import { Plus, Folder, Calendar, User, Search } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import ProjectModal from "../../components/projects/ProjectModal";
import { useGetProjectByIdQuery } from "@/app/redux/api/ProjectsApiSlice";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId] = useState("");

  const { data: project, isLoading, error } = useGetProjectByIdQuery(searchId, {
    skip: !searchId,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchId(searchInput.trim());
    }
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
      header: "Created By",
      accessor: "createdBy",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-zinc-400" />
          <span className="text-sm text-zinc-700">{row.createdBy || "-"}</span>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-600 mt-1">Search projects by ID or create a new one</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> New Project
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
          onRowClick={(row) => console.log('Clicked:', row)}
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
