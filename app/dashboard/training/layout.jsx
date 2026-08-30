'use client';
import Link from 'next/link';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, CalendarDays, MessageSquareWarning, Gauge, FileBarChart, FolderKanban } from 'lucide-react';
import { useListAllProjectsQuery } from '@/app/redux/api/ProjectsApiSlice';

const TrainingScopeContext = createContext({ projectId:'', projects:[] });
export const useTrainingScope = () => useContext(TrainingScopeContext);
export const trainingTabs = [
 {label:'Overview',href:'/dashboard/training',icon:LayoutDashboard},
 {label:'Programs',href:'/dashboard/training/programs',icon:BookOpen},
 {label:'Participants',href:'/dashboard/training/participants',icon:Users},
 {label:'Sessions',href:'/dashboard/training/sessions',icon:CalendarDays},
 {label:'Feedback',href:'/dashboard/training/feedback',icon:MessageSquareWarning},
 {label:'Readiness',href:'/dashboard/training/readiness',icon:Gauge},
 {label:'Reports',href:'/dashboard/training/reports',icon:FileBarChart},
];

export default function TrainingLayout({children}){
 const pathname=usePathname(); const {data=[]}=useListAllProjectsQuery();
 const projects=Array.isArray(data)?data:(data?.content||[]); const [projectId,setProjectId]=useState('');
 useEffect(()=>{setProjectId(localStorage.getItem('trainingProjectId')||'');},[]);
 const select=value=>{setProjectId(value);if(value)localStorage.setItem('trainingProjectId',value);else localStorage.removeItem('trainingProjectId');};
 return <TrainingScopeContext.Provider value={{projectId,projects}}><div className="mx-auto max-w-[1500px] space-y-4">
  <div className="flex flex-col gap-3 rounded-xl border border-navy/8 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/5 text-navy"><FolderKanban size={17}/></span><div><p className="text-xs font-bold uppercase tracking-wider text-navy/35">Training scope</p><p className="text-sm font-bold text-navy">Choose a project or view organization-wide training</p></div></div><select value={projectId} onChange={event=>select(event.target.value)} className="min-w-64 rounded-lg border border-navy/10 bg-white px-3 py-2.5 text-sm font-semibold text-navy outline-none focus:border-navy/35"><option value="">All projects</option>{projects.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}</select></div>
  <div className="overflow-x-auto border-b border-navy/8 custom-scrollbar"><nav className="flex min-w-max gap-1" aria-label="Training sections">{trainingTabs.map(({label,href,icon:Icon})=>{const active=pathname===href||pathname.startsWith(href+'/');return <Link key={href} href={href} className={'flex items-center gap-2 border-b-2 px-3.5 py-3 text-sm font-bold transition-colors '+(active?'border-navy text-navy':'border-transparent text-navy/40 hover:border-navy/20 hover:text-navy')}><Icon size={15}/>{label}</Link>;})}</nav></div>{children}
 </div></TrainingScopeContext.Provider>;
}
