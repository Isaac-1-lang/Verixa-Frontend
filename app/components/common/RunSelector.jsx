"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, PlayCircle, Check } from 'lucide-react';
import { useProject } from '@/app/context/ProjectContext';
import { useListTestRunsByProjectQuery } from '@/app/redux/api/TestRunApiSlice';

export default function RunSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { selectedProjectId, selectedRunId, selectRun } = useProject();

  // Fetch runs for selected project
  const { data: runsData = [], isLoading } = useListTestRunsByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId
  });

  // Filter out null items
  const runs = Array.isArray(runsData) ? runsData.filter(item => item != null) : [];

  // Find selected run
  const selectedRun = runs.find(r => r.id === selectedRunId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRun = (runId) => {
    selectRun(runId);
    setIsOpen(false);
  };

  if (!selectedProjectId) {
    return null; // Don't show run selector if no project selected
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-500">
        <PlayCircle size={16} className="text-zinc-400" />
        <span className="hidden sm:inline">Loading runs...</span>
      </div>
    );
  }

  if (runs.length === 0) {
    return null; // Don't show selector if no runs exist
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors text-sm font-medium text-zinc-700 border border-zinc-200"
        disabled={isLoading}
      >
        <PlayCircle size={16} className="text-emerald-600" />
        <span className="hidden sm:inline">
          {isLoading ? 'Loading...' : selectedRun ? selectedRun.name : 'Select Run'}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-200 bg-zinc-50">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Select Test Run</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {runs.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                No test runs found. Create a test run first.
              </div>
            ) : (
              <div className="p-2">
                {runs.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => handleSelectRun(run.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedRunId === run.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedRunId === run.id ? 'bg-emerald-100' : 'bg-zinc-100'
                      }`}>
                        <PlayCircle size={16} className={selectedRunId === run.id ? 'text-emerald-600' : 'text-zinc-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{run.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            run.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            run.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {run.status}
                          </span>
                          <span className="text-xs text-zinc-500">{run.environment}</span>
                        </div>
                      </div>
                    </div>
                    {selectedRunId === run.id && (
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {runs.length > 0 && (
            <div className="p-2 border-t border-zinc-200 bg-zinc-50">
              <button
                onClick={() => handleSelectRun(null)}
                className="w-full px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors text-center"
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
