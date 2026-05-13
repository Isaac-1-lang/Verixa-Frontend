"use client";
import { useState, useEffect, useRef } from 'react';
import { Folder, ChevronDown, Check } from 'lucide-react';
import { useProject } from '@/app/context/ProjectContext';
import { useGetProjectByIdQuery } from '@/app/redux/api/ProjectsApiSlice';

export default function ProjectSelector() {
  const { selectedProjectId, selectProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [inputId, setInputId] = useState('');
  const [searchId, setSearchId] = useState('');
  const dropdownRef = useRef(null);

  const { data: project, isLoading } = useGetProjectByIdQuery(searchId, {
    skip: !searchId,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load current project if selectedProjectId exists
  useEffect(() => {
    if (selectedProjectId) {
      setSearchId(selectedProjectId.toString());
    }
  }, [selectedProjectId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputId.trim()) {
      setSearchId(inputId.trim());
    }
  };

  const handleSelectProject = () => {
    if (project?.id) {
      selectProject(project.id);
      setIsOpen(false);
    }
  };

  const currentProject = selectedProjectId && project?.id === selectedProjectId ? project : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
      >
        <Folder size={16} className="text-[var(--primary)]" />
        <span className="font-semibold text-zinc-900 hidden sm:inline">
          {currentProject ? currentProject.name : 'Select Project'}
        </span>
        <ChevronDown size={14} className="text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Select Project
            </h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Project ID..."
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-semibold hover:bg-[#5851e6] transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                Loading...
              </div>
            ) : project ? (
              <div
                onClick={handleSelectProject}
                className={`p-4 hover:bg-zinc-50 cursor-pointer transition-colors flex items-center justify-between ${
                  selectedProjectId === project.id ? 'bg-[var(--primary)]/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <Folder size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 text-sm">{project.name}</p>
                    <p className="text-xs text-zinc-500">ID: {project.id}</p>
                  </div>
                </div>
                {selectedProjectId === project.id && (
                  <Check size={16} className="text-[var(--primary)]" />
                )}
              </div>
            ) : searchId ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                Project not found
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">
                Enter a Project ID to search
              </div>
            )}
          </div>

          {currentProject && (
            <div className="p-3 border-t border-zinc-200 bg-zinc-50">
              <button
                onClick={() => {
                  selectProject(null);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
