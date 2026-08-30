'use client';
import Link from 'next/link';
import { GraduationCap, Plus, Users, CalendarDays, BookOpen, Gauge, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useGetMeQuery, useGetTrainingProgramsQuery, useGetTrainingSessionsQuery, useGetTrainingParticipantsQuery } from '@/app/redux/api/TrainingApiSlice';

const pageContent = (value) => value?.content ?? (Array.isArray(value) ? value : []);
const total = (value) => value?.totalElements ?? pageContent(value).length;

export default function TrainingDashboardPage() {
  const me = useGetMeQuery();
  const organizationId = me.data?.organizations?.[0]?.id;
  const args = { organizationId, page: 0, size: 100 };
  const programs = useGetTrainingProgramsQuery(args, { skip: !organizationId });
  const sessions = useGetTrainingSessionsQuery(args, { skip: !organizationId });
  const participants = useGetTrainingParticipantsQuery(args, { skip: !organizationId });
  const loading = me.isLoading || programs.isLoading || sessions.isLoading || participants.isLoading;
  const error = me.error || programs.error || sessions.error || participants.error;

  const programRows = pageContent(programs.data);
  const sessionRows = pageContent(sessions.data);
  const activePrograms = programRows.filter((item) => ['ACTIVE', 'PLANNED'].includes(item.status)).length;
  const completedSessions = sessionRows.filter((item) => item.status === 'COMPLETED').length;

  const metrics = [
    { label: 'Training programs', value: total(programs.data), detail: activePrograms + ' active or planned', icon: BookOpen, href: '/dashboard/training/programs' },
    { label: 'Participants', value: total(participants.data), detail: 'Reusable organization participants', icon: Users, href: '/dashboard/training/participants' },
    { label: 'Sessions', value: total(sessions.data), detail: completedSessions + ' completed', icon: CalendarDays, href: '/dashboard/training/sessions' },
    { label: 'Readiness', value: 'â€”', detail: 'Available after attendance and assessments', icon: Gauge, href: '/dashboard/training/readiness' },
  ];

  if (loading) return <div className="space-y-5 animate-pulse"><div className="h-44 rounded-2xl bg-navy/8" /><div className="grid md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-navy/5 rounded-xl" />)}</div></div>;
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><AlertTriangle className="mx-auto text-red-500" /><h1 className="font-bold text-navy text-xl mt-3">Training data could not be loaded</h1><p className="text-sm text-navy/50 mt-2">Check that the backend is running and your account belongs to an organization.</p><button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-navy text-white font-bold"><RefreshCw size={15}/>Retry</button></div>;

  return <div className="space-y-6">
    <section className="rounded-2xl bg-navy text-white p-6 sm:p-8 overflow-hidden relative">
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div><div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-[.18em]"><GraduationCap size={16}/>Software adoption training</div><h1 className="text-3xl sm:text-4xl font-bold mt-4">Training command center</h1><p className="text-white/60 mt-3 max-w-2xl">See who should be trained, who attended, what users struggled with, and whether each group is ready to use the system.</p></div>
        <Link href="/dashboard/training/programs" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-navy font-bold"><Plus size={16}/>Create training program</Link>
      </div>
    </section>

    {!organizationId && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><strong>No organization selected.</strong> Join or create an organization before managing training.</div>}

    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{metrics.map(({label,value,detail,icon:Icon,href}) => <Link key={label} href={href} className="bg-white border border-navy/8 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-start justify-between"><span className="w-10 h-10 rounded-lg bg-navy/5 grid place-items-center"><Icon size={18}/></span><ArrowRight size={15} className="text-navy/20"/></div><p className="text-3xl font-bold text-navy mt-5">{value}</p><p className="font-bold text-navy/60 text-sm mt-1">{label}</p><p className="text-xs text-navy/35 mt-2">{detail}</p></Link>)}</div>

    <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5">
      <section className="bg-white border border-navy/8 rounded-xl overflow-hidden"><div className="p-5 border-b border-navy/6"><h2 className="font-bold text-navy">Training programs</h2><p className="text-xs text-navy/40 mt-1">Current persisted programs for {me.data?.organizations?.[0]?.name ?? 'your organization'}</p></div>
        {programRows.length ? <div className="divide-y divide-navy/5">{programRows.slice(0,5).map(item => <Link key={item.id} href="/dashboard/training/programs" className="p-5 flex items-center justify-between hover:bg-navy/[.02]"><div><p className="font-bold text-navy">{item.title}</p><p className="text-xs text-navy/40 mt-1">{item.data?.description || 'No description provided'}</p></div><span className="badge">{item.status}</span></Link>)}</div> : <div className="p-12 text-center"><BookOpen className="mx-auto text-navy/15"/><p className="font-bold text-navy mt-3">No training programs yet</p><p className="text-sm text-navy/40 mt-1">Create the first program to start organizing participants and sessions.</p></div>}
      </section>
      <section className="bg-white border border-navy/8 rounded-xl p-5"><h2 className="font-bold text-navy">Operational workflow</h2><div className="mt-5 space-y-4">{['Create a program and its topics','Add participants and groups','Schedule sessions and assign trainers','Record attendance and assessments','Resolve training feedback','Review transparent readiness'].map((step,index)=><div key={step} className="flex gap-3"><span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold grid place-items-center shrink-0">{index+1}</span><p className="text-sm font-semibold text-navy/60 pt-1">{step}</p></div>)}</div></section>
    </div>
  </div>;
}