"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderPlus, LayoutDashboard } from 'lucide-react';
import ProjectModal from '@/app/components/projects/ProjectModal';

export default function ProjectOnboardingPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4">
    <section className="w-full rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-xl shadow-navy/5 sm:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-white"><FolderPlus size={24} /></div>
      <h1 className="mt-5 text-2xl font-bold text-navy">Would you like to create a project now?</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy/50">Choose the project&apos;s current stage and Verixa will take you to the most relevant workspace.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white"><FolderPlus size={16} />Create Project</button>
        <button onClick={() => router.replace('/dashboard')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/10 px-6 py-3 text-sm font-bold text-navy"><LayoutDashboard size={16} />Not Now</button>
      </div>
    </section>
    <ProjectModal isOpen={creating} onClose={() => setCreating(false)} />
  </div>;
}
