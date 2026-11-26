import React from 'react';
import { Clock, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { LanguageMenu } from './LanguageMenu';
import { useLanguage } from '../context/LanguageContext';
import { COMPANY } from '../content/company';
import { handleWaClick, waLink } from '../lib/wa';

const linkClass =
  'inline-flex min-h-11 items-center text-sm text-[#EDE8DE] hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '#/' },
    { label: t('nav.products'), href: '#/products' },
    { label: t('nav.science'), href: '#/science' },
    { label: t('nav.impact'), href: '#/impact' },
    { label: t('nav.resources'), href: '#/impact#resources' },
    { label: t('nav.track'), href: '#/track' },
    { label: t('nav.about'), href: '#/about' },
    { label: t('nav.contact'), href: '#/contact' },
  ];

  const partnerLinks = [
    { label: t('footer.distributor'), href: '#/partner/distributor' },
    { label: t('footer.partner'), href: '#/partner/partner' },
    { label: t('footer.affiliate'), href: '#/partner/affiliate' },
  ];

  const legalLinks = [
    { label: t('footer.terms'), href: '#/terms' },
    { label: t('footer.privacy'), href: '#/privacy' },
    { label: t('footer.shipping'), href: '#/shipping-policy' },
    { label: t('footer.refund'), href: '#/refund-policy' },
    { label: t('footer.grievance'), href: '#/terms?section=grievance' },
  ];

  const socialIcons = [
    {
      name: 'LinkedIn',
      href: '#', // TODO(client): Add official LinkedIn URL
      color: '#0A66C2',
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.85 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/coldeasyglobal',
      color: '#E4405F',
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#', // TODO(client): Add official Facebook URL
      color: '#1877F2',
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#', // TODO(client): Add official YouTube URL
      color: '#FF0000',
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: waLink({ type: 'general' }),
      color: '#25D366',
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm0 18.08c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.136 8.136 0 0 1-1.25-4.3c0-4.51 3.67-8.18 8.18-8.18 2.19 0 4.24.85 5.79 2.4 1.55 1.55 2.4 3.6 2.4 5.79 0 4.51-3.67 8.17-8.18 8.17Zm4.48-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29Z" />
        </svg>
      ),
    },
  ];

  const visibleSocials = socialIcons.filter((soc) => soc.href !== '#');

  const linkList = (links: { label: string; href: string }[]) => (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className={linkClass}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="w-full border-t-4 border-leaf/50 bg-[#18140E] pb-10 pt-6 text-[#EDE8DE] lg:pb-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-[480px]">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">{t('footer.talk_heading')}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={waLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWaClick({ type: 'general' })}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-leaf px-3 font-heading text-sm font-bold uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {t('footer.whatsapp_cta')}
            </a>
            <a
              href={`tel:${COMPANY.phoneTel}`}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 font-heading text-sm font-bold uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span>{t('footer.call_cta')}</span>
                <span className="hidden font-body text-[11px] font-semibold normal-case tracking-normal lg:inline">
                  {COMPANY.phoneDisplay}
                </span>
              </span>
            </a>
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#EDE8DE]">
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('contact.hours')}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`mailto:${COMPANY.emails.info}`}
              className="inline-flex min-h-11 items-center underline decoration-[#EDE8DE]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]"
            >
              {COMPANY.emails.info}
            </a>
          </p>
        </div>

        <div className="mt-4 hidden gap-8 lg:mt-8 lg:grid lg:grid-cols-3">
          <div>
            <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-sky">{t('footer.explore')}</h3>
            {linkList(navLinks)}
          </div>
          <div>
            <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-olive">
              {t('footer.partner_heading')}
            </h3>
            {linkList(partnerLinks)}
          </div>
          <div>
            <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-sky">{t('footer.help')}</h3>
            {linkList(legalLinks)}
          </div>
        </div>

        <div className="mt-4 border-t border-[#EDE8DE]/25 lg:hidden">
          <details className="border-b border-[#EDE8DE]/25">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-heading text-xs font-bold uppercase tracking-wider text-sky focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]">
              {t('footer.explore')}
            </summary>
            {linkList(navLinks)}
          </details>
          <details className="border-b border-[#EDE8DE]/25">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-heading text-xs font-bold uppercase tracking-wider text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]">
              {t('footer.partner_heading')}
            </summary>
            {linkList(partnerLinks)}
          </details>
          <nav className="flex flex-wrap gap-x-4" aria-label={t('footer.help')}>
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center px-1 text-xs text-[#EDE8DE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-4" style={{ ['--color-ink' as string]: '#251A10' }}>
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-wider">{t('footer.language')}</p>
          <LanguageMenu placement="up" align="left" />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {visibleSocials.map((soc) => (
            <a
              key={soc.name}
              href={soc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE8DE]"
              style={{ color: soc.color }}
              aria-label={soc.name}
              onClick={soc.name === 'WhatsApp' ? () => handleWaClick({ type: 'general' }) : undefined}
            >
              {soc.svg}
            </a>
          ))}
        </div>

        <div className="mt-4 max-w-md space-y-2 text-xs leading-relaxed text-[#EDE8DE]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-sky" aria-hidden="true" />
            <span className="text-xs font-semibold text-white">{t('footer.secure_razorpay')}</span>
          </div>
          <p>{t('footer.copyright')}</p>
          <p>
            {COMPANY.legalName} · CIN {COMPANY.cin} · GSTIN {COMPANY.gstin}
          </p>
          <p>{t('footer.registered_office', { address: COMPANY.registeredOffice })}</p>
        </div>
      </div>
    </footer>
  );
};
