"use client";

import { useRouter } from 'next/navigation';
import ProjectModal from '@/app/components/projects/ProjectModal';

export default function NewProjectPage() {
  const router = useRouter();
  return <div className="min-h-[60vh]">
    <ProjectModal isOpen onClose={() => router.replace('/dashboard/projects')} />
  </div>;
}
