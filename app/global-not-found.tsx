import type { Metadata } from 'next';
import './globals.css';
import { montserrat, poppins } from '@/lib/fonts';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { getMessages, getTranslator } from '@/lib/i18n/dictionary';
import { I18nProvider } from '@/lib/i18n/client';
import { NotFoundView } from '@/components/pages/NotFoundView';

/**
 * 404 for URLs that match no route. The root layout sits under [locale], so Next.js needs
 * this separate file (experimental.globalNotFound) to render a branded page with the shell.
 */
export const metadata: Metadata = {
  title: getTranslator(DEFAULT_LOCALE)('notfound.title'),
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${montserrat.variable} ${poppins.variable}`}>
      <body>
        <I18nProvider locale={DEFAULT_LOCALE} messages={getMessages(DEFAULT_LOCALE)}>
          <NotFoundView />
        </I18nProvider>
      </body>
    </html>
  );
}
