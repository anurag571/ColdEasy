import type { Metadata } from 'next';
import { preload } from 'react-dom';
import type { Locale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionary';
import { MaybePlaceholder, PlaceholderPill } from '@/components/ui/PlaceholderPill';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TomatoTimelapse } from '@/components/media/TomatoTimelapse';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { title: getTranslator(locale)('science.hero.title') };
}

/** Science, Phase 1 slice: hero plus the ported tomato time-lapse. Full page is Phase 7. */
export default async function SciencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getTranslator(locale);
  // The poster is the largest paint on this page; fetch it early.
  preload('/video/tomato-decay-poster.jpg', { as: 'image', fetchPriority: 'high' });
  return (
    <>
      <section className="section-y">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-[2rem] leading-tight font-bold md:text-[3.5rem]">
              {t('science.hero.title')}
            </h1>
            <p className="mt-4 max-w-[60ch] text-fg-muted">
              <MaybePlaceholder text={t('science.hero.intro')} />
            </p>
          </div>
          <div>
            <SectionHeading as="h2" className="mb-5">
              {t('science.tomato.heading')}
            </SectionHeading>
            <TomatoTimelapse />
          </div>
        </div>
      </section>
      <div className="container-site pb-16">
        <PlaceholderPill>{t('science.next_phase')}</PlaceholderPill>
      </div>
    </>
  );
}
