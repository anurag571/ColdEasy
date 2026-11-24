'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/client';
import { localePath } from '@/lib/i18n/config';
import type { MessageKey } from '@/lib/i18n/dictionary';
import { mainNav } from '@/lib/config/site';
import { waLink } from '@/lib/wa';
import { track } from '@/lib/track';
import { cn } from '@/components/ui/cn';
import { Logo } from '@/components/ui/Logo';
import { ChatIcon, CloseIcon, MenuIcon } from '@/components/icons';

/**
 * Sticky header (docs/04 §5): 80 px shrinking to 56 px, logo 44 px shrinking to 32 px.
 * WhatsApp and Menu stay reachable on every screen (docs/04 §7 rule 3).
 */
export function Header({ theme }: { theme: 'light' | 'dark' }) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  const isActive = (href: string) => {
    const full = localePath(locale, href);
    return href === '/' ? pathname === full : pathname.startsWith(full);
  };

  const logoVariant = theme === 'dark' ? 'reversed' : 'color';

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-0" />
      <header
        className={cn(
          'sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85',
          'transition-[min-height] duration-200',
        )}
      >
        <div
          className={cn(
            'container-site flex items-center justify-between gap-4 transition-[min-height] duration-200',
            scrolled ? 'min-h-14' : 'min-h-20',
          )}
        >
          <Link
            href={localePath(locale, '/')}
            aria-label={t('header.home_label')}
            className="shrink-0"
          >
            <Logo variant={logoVariant} height={scrolled ? 32 : 44} alt="" priority />
          </Link>

          <nav aria-label={t('nav.label')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localePath(locale, item.href)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-12 items-center rounded-full px-4 font-heading text-sm font-semibold',
                      'hover:bg-fg/5 aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8',
                    )}
                  >
                    {t(item.key as MessageKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={waLink(t, 'header')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { context: 'header' })}
              aria-label={`${t('header.whatsapp_label')} ${t('common.new_tab')}`}
              className="inline-flex size-12 items-center justify-center rounded-full bg-leaf text-white hover:bg-leaf-dark"
            >
              <ChatIcon />
            </a>
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full hover:bg-fg/5 lg:hidden"
              aria-label={t('header.menu_open')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <dialog
        id="mobile-menu"
        ref={menuRef}
        onClose={() => setMenuOpen(false)}
        aria-label={t('nav.label')}
        className="m-0 ml-auto h-dvh max-h-none w-[min(100%,22rem)] max-w-none bg-transparent p-0 backdrop:bg-ink/60"
      >
        <div data-theme={theme} className="flex h-full flex-col bg-surface p-4 text-fg">
          <div className="flex items-center justify-between">
            <Logo variant={logoVariant} height={36} alt="" />
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full hover:bg-fg/5"
              aria-label={t('header.menu_close')}
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label={t('nav.label')} className="mt-6">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={localePath(locale, item.href)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="flex min-h-14 items-center font-heading text-lg font-semibold aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(item.key as MessageKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
