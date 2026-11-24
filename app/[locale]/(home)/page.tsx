import Image from 'next/image';
import type { Locale } from '@/lib/i18n/config';
import { localePath } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionary';
import { ButtonLink } from '@/components/ui/Button';
import { PlaceholderPill } from '@/components/ui/PlaceholderPill';
import { SeedGrid } from '@/components/ui/Pattern';

/**
 * Home, Phase 1 slice: the dark hero only, so the theme, header, footer and tokens can be
 * reviewed together. Ported from the prototype's dark home with the bottom white gradient
 * removed (docs/11 A5). The rest of the page is Phase 2 (B2-01 onwards).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getTranslator(locale);

  return (
    <>
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <SeedGrid opacity={0.06} />
        <div className="container-site relative grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-14 lg:py-24">
          <div className="lg:col-span-7">
            <h1
              id="hero-title"
              className="font-heading text-4xl leading-[1.1] font-extrabold tracking-tight md:text-6xl"
            >
              {t('home.hero.title')}
            </h1>
            <p className="mt-4 font-heading text-xl font-semibold text-fg-muted md:text-2xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={localePath(locale, '/products')}>
                {t('home.hero.cta_buy')}
              </ButtonLink>
              <ButtonLink href={localePath(locale, '/science')} variant="secondary">
                {t('home.hero.cta_how')}
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 lg:col-span-5">
            {/*
              Placeholder image. It is AI-generated (visible tool mark), so it cannot ship (docs/11 A7).
              The prototype's hero image was dropped: it had text printed on it and an AI-generated
              person shown as a customer. Beige studio shots read as boxes on dark (docs/11 A5),
              so this sits on a sand stage until the real cut-out photo (11:K4-03) arrives.
            */}
            <div className="w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-sand">
              <Image
                src="/products/coldeasy-box/placeholder-studio-front.jpg"
                alt={t('home.hero.image_alt')}
                width={1024}
                height={571}
                priority
                sizes="(min-width: 1024px) 460px, 90vw"
                className="h-auto w-full"
              />
            </div>
            <PlaceholderPill>{t('home.hero.image_pending')}</PlaceholderPill>
          </div>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="container-site py-10">
          <PlaceholderPill>{t('home.next_phase')}</PlaceholderPill>
        </div>
      </section>
    </>
  );
}
