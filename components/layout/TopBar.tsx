'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/client';
import { localePath } from '@/lib/i18n/config';
import { waLink } from '@/lib/wa';
import { track } from '@/lib/track';
import { CartIcon, ChatIcon } from '@/components/icons';
import { SignupDialog } from './SignupDialog';

/**
 * Marigold top bar, ink text, 40 px on mobile (docs/04 §5). Sign-up, WhatsApp and Cart.
 * After sign-up (Phase 5) it becomes the slimmer bar with WhatsApp and Cart only.
 */
export function TopBar() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <aside aria-label={t('topbar.label')} className="bg-marigold text-ink">
      <div className="container-site flex min-h-10 items-center justify-between gap-3 text-sm">
        <p className="flex min-w-0 items-center gap-2">
          <span className="hidden truncate sm:inline">{t('topbar.message')}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-10 items-center rounded-full px-2 font-heading font-bold uppercase underline underline-offset-4 hover:no-underline"
          >
            {t('topbar.signup')}
          </button>
        </p>
        <div className="flex items-center gap-1">
          <a
            href={waLink(t, 'top_bar')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { context: 'top_bar' })}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 font-medium hover:underline"
          >
            <ChatIcon width={18} height={18} />
            <span>{t('topbar.whatsapp')}</span>
            <span className="sr-only">{t('common.new_tab')}</span>
          </a>
          <Link
            href={localePath(locale, '/cart')}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 font-medium hover:underline"
            aria-label={t('header.cart_label', { count: 0 })}
          >
            <CartIcon width={18} height={18} />
            <span className="hidden sm:inline">{t('header.cart')}</span>
          </Link>
        </div>
      </div>
      <SignupDialog open={open} onClose={() => setOpen(false)} />
    </aside>
  );
}
