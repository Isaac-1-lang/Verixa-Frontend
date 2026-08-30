import { notFound } from 'next/navigation';
import LifecycleModule from '@/app/components/platform/LifecycleModule';
import AccessManagement from '@/app/components/platform/AccessManagement';
import { getModule } from '@/app/config/moduleCatalog';

export default async function PlatformModulePage({ params }) {
  const { module } = await params;
  const config = getModule(module);
  if (!config) notFound();
  if (module === 'access') return <AccessManagement />;
  return <LifecycleModule moduleKey={module} />;
}
