import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';
import type { Locale } from '@/lib/i18n/config';
import { isOn } from '@/lib/flags';

/** Home is dark when the dark_home change request is on (docs/11 A5, 11:K4-01). */
export default async function HomeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <SiteShell locale={locale as Locale} theme={isOn('dark_home') ? 'dark' : 'light'}>
      {children}
    </SiteShell>
  );
}
