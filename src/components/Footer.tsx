import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, ChevronDown, ShieldCheck, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { COMPANY } from '../content/company';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleMobileSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const navLinks = [
    { label: t('nav.home'), href: '#/' },
    { label: t('nav.products'), href: '#/products' },
    { label: t('nav.science'), href: '#/science' },
    { label: t('nav.impact'), href: '#/impact' },
    { label: t('nav.resources'), href: '#/impact#resources' },
    { label: t('nav.track'), href: '#/track' },
    { label: t('nav.about'), href: '#/about' },
  ];

  const partnerLinks = [
    { label: t('footer.distributor'), href: '#/partner/distributor' },
    { label: t('footer.partner'), href: '#/partner/partner' },
    { label: t('footer.affiliate'), href: '#/partner/affiliate' },
  ];

  const legalLinks = [
    { label: t('footer.terms'), href: '#/terms' },
    { label: t('footer.privacy'), href: '#/privacy' },
  ];

  const socialIcons = [
    {
      name: 'LinkedIn',
      href: '#', // TODO(client): Add official LinkedIn URL
      color: '#0A66C2',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.85 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/coldeasyglobal',
      color: '#E4405F',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#', // TODO(client): Add official Facebook URL
      color: '#1877F2',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#', // TODO(client): Add official YouTube URL
      color: '#FF0000',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0',
      color: '#25D366',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm0 18.08c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.136 8.136 0 0 1-1.25-4.3c0-4.51 3.67-8.18 8.18-8.18 2.19 0 4.24.85 5.79 2.4 1.55 1.55 2.4 3.6 2.4 5.79 0 4.51-3.67 8.17-8.18 8.17Zm4.48-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#18140E] text-[#EDE8DE] pt-16 pb-12 border-t-4 border-leaf/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Desktop 3 Columns */}
        <div className="hidden lg:grid grid-cols-12 gap-8 pb-12 border-b border-[#EDE8DE]/15">
          {/* Column 1: Brand (4 cols) */}
          <div className="col-span-4 flex flex-col justify-between">
            <div>
              <Logo variant="horizontal-reversed" height={42} />
              <p className="mt-3 text-sm text-[#EDE8DE]/80 font-body">
                {t('footer.tagline')}
              </p>
              <p className="mt-1 text-xs text-[#EDE8DE]/60 font-body">{t('footer.product_of')}</p>

              {/* Social icons: large icons on white circles with brand colours */}
              <div className="flex items-center gap-3.5 mt-6">
                {socialIcons.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
                    style={{ color: soc.color }}
                    aria-label={soc.name}
                  >
                    {soc.svg}
                  </a>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#EDE8DE]/60 mt-8 font-body">
              {t('footer.copyright')}
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[#EDE8DE] font-body">
              {COMPANY.legalName} · CIN {COMPANY.cin} · GSTIN {COMPANY.gstin}
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-[#EDE8DE] font-body">
              Registered office: {COMPANY.registeredOffice}
            </p>
          </div>

          {/* Column 2: Navigation & Partner (5 cols) */}
          <div className="col-span-5 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-sky mb-4">
                {t('footer.nav_heading')}
              </h4>
              <ul className="space-y-2.5 text-sm text-[#EDE8DE]/85 font-body">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
                {/* Contact Us with reveal card */}
                <li
                  className="relative"
                  onMouseEnter={() => setIsContactHovered(true)}
                  onMouseLeave={() => setIsContactHovered(false)}
                >
                  <a
                    href="#/contact"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium text-marigold"
                  >
                    {t('nav.contact')}
                  </a>
                  <div
                    className={`mt-2 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs text-xs space-y-2 border border-white/15 transition-all duration-300 ${
                      isContactHovered
                        ? 'opacity-100 max-h-48'
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#EDE8DE]/95">
                      <Phone className="w-3.5 h-3.5 text-sky shrink-0" />
                      <span>+91 91829 68542</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#EDE8DE]/95">
                      <Mail className="w-3.5 h-3.5 text-sky shrink-0" />
                      <span>info@coldeasy.in</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#EDE8DE]/95">
                      <Clock className="w-3.5 h-3.5 text-sky shrink-0" />
                      <span>{t('contact.hours')}</span>
                    </div>
                    <a
                      href={COMPANY.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-[#EDE8DE]/95 hover:text-white underline decoration-dotted"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky shrink-0 mt-0.5" />
                      <span>{t('footer.maps')}</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-olive mb-4">
                {t('footer.partner_heading')}
              </h4>
              <ul className="space-y-2.5 text-sm text-[#EDE8DE]/85 font-body">
                {partnerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Trust badge, WhatsApp & Legal (3 cols) */}
          <div className="col-span-3 flex flex-col justify-between items-start">
            <div className="w-full space-y-5">
              {/* Secure payments badge: ONLY "Secure payment by Razorpay" per brief */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-sky shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-semibold text-white tracking-wide">
                    {t('footer.secure_razorpay')}
                  </span>
                </div>
              </div>

              {/* Strong WhatsApp CTA pill */}
              <a
                href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-md flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                {t('topbar.connect_wa')}
              </a>
            </div>

            <div className="pt-6 text-xs text-[#EDE8DE]/60 flex items-center gap-3 flex-wrap">
              {legalLinks.map((ll, idx) => (
                <React.Fragment key={ll.label}>
                  <a href={ll.href} className="hover:text-white transition-colors">
                    {ll.label}
                  </a>
                  {idx < legalLinks.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View: Brand, WhatsApp CTA, Collapsible Links, Legal */}
        <div className="lg:hidden flex flex-col space-y-8 pb-10 border-b border-[#EDE8DE]/15">
          {/* Brand */}
          <div>
            <Logo variant="horizontal-reversed" height={36} />
            <p className="mt-3 text-sm text-[#EDE8DE]/80 font-body">
              {t('footer.tagline')}
            </p>
            <p className="text-xs text-[#EDE8DE]/60 font-body">{t('footer.product_of')}</p>

            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs"
                  style={{ color: soc.color }}
                  aria-label={soc.name}
                >
                  {soc.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Strong WhatsApp CTA */}
          <a
            href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm text-center"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            {t('topbar.connect_wa')}
          </a>

          {/* Secure payment by Razorpay */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-sky shrink-0" />
            <span className="text-xs font-semibold text-white">{t('footer.secure_razorpay')}</span>
          </div>

          {/* Collapsible Section 1: Navigation */}
          <div className="border-t border-[#EDE8DE]/15 pt-4">
            <button
              onClick={() => toggleMobileSection('nav')}
              className="w-full flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-sky py-2 cursor-pointer"
            >
              <span>{t('footer.nav_heading')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openSection === 'nav' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'nav' && (
              <ul className="mt-3 space-y-3 text-sm text-[#EDE8DE]/85 font-body pl-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2 text-xs text-[#EDE8DE]/75 border-t border-white/10 space-y-1">
                  <div className="font-semibold text-marigold">{t('footer.contact_label')}</div>
                  <div>{t('footer.phone')}</div>
                  <div>{t('footer.email')}</div>
                  <div>{t('footer.hours')}</div>
                  <a
                    href={COMPANY.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky hover:underline block"
                  >
                    {t('footer.maps_short')}
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Collapsible Section 2: Partner With Us */}
          <div className="border-t border-[#EDE8DE]/15 pt-4">
            <button
              onClick={() => toggleMobileSection('partner')}
              className="w-full flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-olive py-2 cursor-pointer"
            >
              <span>{t('footer.partner_heading')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openSection === 'partner' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'partner' && (
              <ul className="mt-3 space-y-3 text-sm text-[#EDE8DE]/85 font-body pl-2">
                {partnerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Legal and Copyright */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE8DE]/60">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {legalLinks.map((ll, idx) => (
                <React.Fragment key={ll.label}>
                  <a href={ll.href} className="hover:text-white">
                    {ll.label}
                  </a>
                  {idx < legalLinks.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="text-center sm:text-right">
              <div>{t('footer.copyright')}</div>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#EDE8DE] sm:ml-auto">
                {COMPANY.legalName} · CIN {COMPANY.cin} · GSTIN {COMPANY.gstin}
              </p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#EDE8DE] sm:ml-auto">
                Registered office: {COMPANY.registeredOffice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
