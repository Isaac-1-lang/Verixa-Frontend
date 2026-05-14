"use client";
import { useState, useEffect, useRef } from 'react';
import { Folder, ChevronDown, Check } from 'lucide-react';
import { useProject } from '@/app/context/ProjectContext';
import { useListAllProjectsQuery } from '@/app/redux/api/ProjectsApiSlice';

export default function ProjectSelector() {
  const { selectedProjectId, selectProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: projects = [], isLoading } = useListAllProjectsQuery();

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

  const currentProject = projects.find(p => p.id === selectedProjectId);

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
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Select Project
            </h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                No projects found. Create your first project!
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    selectProject(project.id);
                    setIsOpen(false);
                  }}
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
              ))
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
