import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { plannedRoutes } from '@/lib/config/site';
import { localePath, type Locale } from '@/lib/i18n/config';
import { getTranslator, type MessageKey } from '@/lib/i18n/dictionary';
import { isProduction } from '@/lib/env';
import { ButtonLink } from '@/components/ui/Button';
import { PlaceholderPill } from '@/components/ui/PlaceholderPill';

/**
 * Pages that are linked from the header and footer but built in a later phase.
 * Staging shows a marked "being built" page so links work; production returns 404.
 */
export function generateStaticParams() {
  if (isProduction) return [];
  return Object.keys(plannedRoutes).map((path) => ({ slug: path.slice(1).split('/') }));
}

export const dynamicParams = false;

function lookup(slug: string[]) {
  return plannedRoutes[`/${slug.join('/')}`];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const route = lookup(slug);
  if (!route) return {};
  return { title: getTranslator(locale)(route.titleKey as MessageKey) };
}

export default async function PlannedPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const route = lookup(slug);
  if (!route || isProduction) notFound();
  const t = getTranslator(locale);
  return (
    <section className="section-y">
      <div className="container-site flex flex-col items-start gap-5">
        <h1 className="font-heading text-[2rem] font-bold md:text-[3.5rem]">
          {t(route.titleKey as MessageKey)}
        </h1>
        <PlaceholderPill>{t('planned.body', { phase: route.phase })}</PlaceholderPill>
        <ButtonLink href={localePath(locale, '/')} variant="secondary">
          {t('planned.back')}
        </ButtonLink>
      </div>
    </section>
  );
}
