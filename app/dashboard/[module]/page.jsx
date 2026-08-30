import { notFound } from 'next/navigation';
import LifecycleModule from '@/app/components/platform/LifecycleModule';
import { getModule } from '@/app/config/moduleCatalog';

export default async function PlatformModulePage({ params }) {
  const { module } = await params;
  const config = getModule(module);
  if (!config) notFound();
  return <LifecycleModule moduleKey={module} />;
}
