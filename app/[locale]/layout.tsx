import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '../globals.css';
import { montserrat, poppins } from '@/lib/fonts';
import { isLiveLocale, LIVE_LOCALES } from '@/lib/i18n/config';
import { getMessages, getTranslator } from '@/lib/i18n/dictionary';
import { I18nProvider } from '@/lib/i18n/client';
import { isProduction, publicEnv } from '@/lib/env';

export function generateStaticParams() {
  return LIVE_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLiveLocale(locale)) return {};
  const t = getTranslator(locale);
  const name = isProduction
    ? t('meta.site_name')
    : `${t('meta.site_name')} · ${t('meta.staging_suffix')}`;
  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title: { default: name, template: `%s | ${name}` },
    description: t('meta.default_description'),
    robots: isProduction ? undefined : { index: false, follow: false },
    icons: { icon: '/brand/coldeasy-symbol-color.png' },
  };
}

export const viewport: Viewport = {
  themeColor: '#FCFBF1',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLiveLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${montserrat.variable} ${poppins.variable}`}>
      <body>
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
