"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProjectView from "../../../components/projects/ProjectView"; 
import { useGetProjectByIdQuery } from '../../../redux/api/ProjectsApiSlice';

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: project, isLoading } = useGetProjectByIdQuery(id, { skip: !id });

  if (isLoading || !project) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] animate-pulse">Loading Module...</p>
    </div>
  );

  return (
    <div className="bg-[var(--bg)] min-h-screen pb-20">
      {/* A. CORE VIEW (Hero, Description, Tech Stack) */}
      <ProjectView 
        project={project} 
        onUpdate={() => alert('Update not supported by backend')} 
        onDelete={() => alert('Delete not supported by backend')} 
      />
    </div>
  );
}