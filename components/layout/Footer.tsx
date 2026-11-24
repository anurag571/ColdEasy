import Link from 'next/link';
import { legalNav, mainNav, partnerNav, site } from '@/lib/config/site';
import { localePath, type Locale } from '@/lib/i18n/config';
import type { MessageKey, Translate } from '@/lib/i18n/dictionary';
import { waLink } from '@/lib/wa';
import { Logo } from '@/components/ui/Logo';
import { MaybePlaceholder } from '@/components/ui/PlaceholderPill';
import { ButtonLink } from '@/components/ui/Button';
import { ChatIcon, InstagramIcon, MailIcon, PhoneIcon } from '@/components/icons';

/**
 * Footer (docs/04 §5): ink background, reversed logo, "Effortless Cooling, Everyday.",
 * three link columns, contact, WhatsApp CTA, social icons, payments row.
 * Social links: only Instagram is confirmed (11:B-06); empty channels are left out, not stubbed.
 */
export function Footer({ t, locale }: { t: Translate; locale: Locale }) {
  const year = new Date().getFullYear();
  const columns: Array<{
    heading: MessageKey;
    items: ReadonlyArray<{ key: string; href: string }>;
  }> = [
    { heading: 'footer.nav_heading', items: mainNav },
    { heading: 'footer.partner_heading', items: partnerNav },
    { heading: 'footer.legal_heading', items: legalNav },
  ];

  return (
    <footer data-theme="dark" className="border-t border-line bg-surface text-fg">
      <div className="container-site py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Logo variant="reversed" height={44} alt={t('meta.site_name')} />
            <p className="font-heading text-lg font-semibold">{t('footer.tagline')}</p>
            <ButtonLink href={waLink(t, 'footer')} external variant="whatsapp" size="sm">
              <ChatIcon width={20} height={20} />
              {t('footer.whatsapp_cta')}
              <span className="sr-only">{t('common.new_tab')}</span>
            </ButtonLink>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={t(col.heading)}>
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.04em] text-fg-muted">
                  {t(col.heading)}
                </h2>
                <ul className="mt-3 flex flex-col">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
                        className="inline-flex min-h-11 items-center hover:underline"
                      >
                        {t(item.key as MessageKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-line pt-8 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.04em] text-fg-muted">
              {t('footer.contact_heading')}
            </h2>
            <ul className="mt-3 flex flex-col gap-1">
              <li>
                <a
                  href={`tel:${site.whatsappE164}`}
                  className="inline-flex min-h-11 items-center gap-2 hover:underline"
                >
                  <PhoneIcon width={18} height={18} />
                  <span className="sr-only">{t('footer.phone_label')}</span>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-2 hover:underline"
                >
                  <MailIcon width={18} height={18} />
                  <span className="sr-only">{t('footer.email_label')}</span>
                  {site.email}
                </a>
              </li>
              <li className="text-sm text-fg-muted">
                <MaybePlaceholder text={t('footer.hours')} />
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div>
              <h2 className="sr-only">{t('footer.social_heading')}</h2>
              <ul className="flex gap-2">
                {site.social.instagram ? (
                  <li>
                    <a
                      href={site.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t('footer.social.instagram')} ${t('common.new_tab')}`}
                      className="inline-flex size-12 items-center justify-center rounded-full border border-line hover:bg-fg/10"
                    >
                      <InstagramIcon />
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            <p className="text-sm text-fg-muted">{t('footer.payments')}</p>
          </div>
        </div>

        <p className="mt-10 text-[13px] text-fg-muted">{t('footer.copyright', { year })}</p>
      </div>
    </footer>
  );
}
