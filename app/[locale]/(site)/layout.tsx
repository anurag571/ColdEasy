import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';
import type { Locale } from '@/lib/i18n/config';

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <SiteShell locale={locale as Locale} theme="light">
      {children}
    </SiteShell>
  );
}
