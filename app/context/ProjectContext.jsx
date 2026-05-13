"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedRunId, setSelectedRunId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProjectId = localStorage.getItem('selectedProjectId');
      const savedRunId = localStorage.getItem('selectedRunId');
      
      if (savedProjectId) {
        setSelectedProjectId(parseInt(savedProjectId));
      }
      if (savedRunId) {
        setSelectedRunId(parseInt(savedRunId));
      }
    }
  }, []);

  // Save to localStorage when changed
  const selectProject = (projectId) => {
    setSelectedProjectId(projectId);
    if (typeof window !== 'undefined') {
      if (projectId) {
        localStorage.setItem('selectedProjectId', projectId.toString());
      } else {
        localStorage.removeItem('selectedProjectId');
      }
    }
    // Clear run selection when project changes
    setSelectedRunId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedRunId');
    }
  };

  const selectRun = (runId) => {
    setSelectedRunId(runId);
    if (typeof window !== 'undefined') {
      if (runId) {
        localStorage.setItem('selectedRunId', runId.toString());
      } else {
        localStorage.removeItem('selectedRunId');
      }
    }
  };

  return (
    <ProjectContext.Provider value={{
      selectedProjectId,
      selectedRunId,
      selectProject,
      selectRun
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
