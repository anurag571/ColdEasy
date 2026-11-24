import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionary';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';

/** Global layout (B1-09): skip link, top bar, sticky header, page, footer. */
export function SiteShell({
  locale,
  theme,
  children,
}: {
  locale: Locale;
  theme: 'light' | 'dark';
  children: ReactNode;
}) {
  const t = getTranslator(locale);
  return (
    <div data-theme={theme} className="flex min-h-dvh flex-col bg-surface text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-ink"
      >
        {t('skip.to_content')}
      </a>
      <TopBar />
      <Header theme={theme} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer t={t} locale={locale} />
    </div>
  );
}
