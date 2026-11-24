import { DEFAULT_LOCALE, localePath } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionary';
import { waLink } from '@/lib/wa';
import { SiteShell } from '@/components/layout/SiteShell';
import { ButtonLink } from '@/components/ui/Button';
import { SeedGrid } from '@/components/ui/Pattern';
import { ChatIcon } from '@/components/icons';

/** Branded 404 with links to Home, Products and WhatsApp (docs/03 §7). Used by both 404 files. */
export function NotFoundView() {
  const locale = DEFAULT_LOCALE;
  const t = getTranslator(locale);
  return (
    <SiteShell locale={locale} theme="light">
      <section className="relative overflow-hidden">
        <SeedGrid />
        <div className="container-site section-y relative flex flex-col items-start gap-5">
          <h1 className="font-heading text-[2rem] font-bold md:text-[3.5rem]">
            {t('notfound.title')}
          </h1>
          <p className="max-w-[60ch] text-fg-muted">{t('notfound.body')}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, '/')}>{t('notfound.home')}</ButtonLink>
            <ButtonLink href={localePath(locale, '/products')} variant="secondary">
              {t('notfound.products')}
            </ButtonLink>
            <ButtonLink href={waLink(t, 'not_found')} external variant="ghost">
              <ChatIcon width={20} height={20} />
              {t('notfound.whatsapp')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
