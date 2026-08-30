'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, CalendarDays, ClipboardCheck, BrainCircuit, MessageSquareWarning, Gauge, FileBarChart } from 'lucide-react';
export const trainingTabs = [
  { label: 'Overview', href: '/dashboard/training', icon: LayoutDashboard },
  { label: 'Programs', href: '/dashboard/training/programs', icon: BookOpen },
  { label: 'Participants', href: '/dashboard/training/participants', icon: Users },
  { label: 'Sessions', href: '/dashboard/training/sessions', icon: CalendarDays },
  { label: 'Attendance', href: '/dashboard/training/attendance', icon: ClipboardCheck },
  { label: 'Assessments', href: '/dashboard/training/assessments', icon: BrainCircuit },
  { label: 'Feedback', href: '/dashboard/training/feedback', icon: MessageSquareWarning },
  { label: 'Readiness', href: '/dashboard/training/readiness', icon: Gauge },
  { label: 'Reports', href: '/dashboard/training/reports', icon: FileBarChart },
];
export default function TrainingLayout({ children }) {
  const pathname = usePathname();
  return <div className="max-w-[1500px] mx-auto"><div className="mb-5 overflow-x-auto custom-scrollbar border-b border-navy/8"><nav className="flex min-w-max gap-1" aria-label="Training sections">{trainingTabs.map(({ label, href, icon: Icon }) => { const active = pathname === href; return <Link key={href} href={href} className={'flex items-center gap-2 px-3.5 py-3 text-sm font-bold border-b-2 transition-colors ' + (active ? 'border-navy text-navy' : 'border-transparent text-navy/40 hover:text-navy hover:border-navy/20')}><Icon size={15} />{label}</Link>; })}</nav></div>{children}</div>;
}