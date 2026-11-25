import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  ShoppingBag,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageMenu } from './LanguageMenu';
import { CartCount } from './CartCount';

interface HeaderProps {
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { language, t } = useLanguage();
  const navClass =
    language === 'en'
      ? 'uppercase tracking-wider'
      : 'normal-case tracking-normal break-words';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // TODO(client): the brief lists two different navs.
  const navLinks = [
    { label: t('nav.home'), href: '#/' },
    { label: t('nav.products'), href: '#/products' },
    { label: t('nav.science'), href: '#/science' },
    { label: t('nav.impact'), href: '#/impact' },
    { label: t('nav.about'), href: '#/about' },
    { label: t('nav.contact'), href: '#/contact' },
  ];

  const isCurrent = (href: string) => {
    if (href === '#/' && (currentRoute === '' || currentRoute === '#/' || currentRoute === '#')) {
      return true;
    }
    return currentRoute === href;
  };

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className={`w-full bg-cream sticky top-[36px] z-30 transition-all duration-250 ${
          isScrolled ? 'min-h-[56px] shadow-xs border-b border-ink/10' : 'min-h-[72px] md:min-h-[80px]'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 min-h-[inherit] py-2 flex items-center justify-between gap-3">
          {/* Logo on the left */}
          <a
            href="#/"
            className="flex items-center gap-2 group focus:outline-hidden focus:ring-2 focus:ring-leaf/40 rounded-lg p-1"
            aria-label={t('header.home')}
          >
            <Logo
              variant="horizontal-color"
              height={isScrolled ? 32 : 44}
              className="transition-all duration-250"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div
              className={`flex flex-wrap items-center transition-all duration-250 font-heading font-semibold text-xs lg:text-sm ${navClass} ${
                isScrolled ? 'gap-x-5 gap-y-1 lg:gap-x-7' : 'gap-x-6 gap-y-1 lg:gap-x-8'
              }`}
            >
              {navLinks.map((link) => {
                const active = isCurrent(link.href);
                const isContact = link.href === '#/contact';

                if (isContact) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setIsContactHovered(true)}
                      onMouseLeave={() => setIsContactHovered(false)}
                    >
                      <a
                        href={link.href}
                        className={`relative py-1 transition-colors hover:text-leaf inline-flex items-center gap-1 ${
                          active ? 'text-leaf font-bold' : 'text-ink'
                        }`}
                      >
                        {link.label}
                        {active && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-leaf rounded-full" />
                        )}
                      </a>

                      {/* Subtle hover popup showing phone, email and address buttons */}
                      {isContactHovered && (
                        <div className="absolute right-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="w-56 p-2.5 rounded-2xl bg-white shadow-xl border border-ink/10 text-xs font-heading font-semibold flex flex-col gap-1.5 backdrop-blur-md">
                            <a
                              href="tel:+919182968542"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink hover:bg-sand hover:text-leaf transition-colors"
                            >
                              <Phone className="w-4 h-4 text-leaf shrink-0" />
                              <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold">{t('header.call')}</span>
                                <span className="text-[10px] text-ink-60 font-body">
                                  +91 91829 68542
                                </span>
                              </div>
                            </a>

                            <a
                              href="mailto:info@coldeasy.in"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink hover:bg-sand hover:text-leaf transition-colors"
                            >
                              <Mail className="w-4 h-4 text-sky shrink-0" />
                              <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold">{t('header.email')}</span>
                                <span className="text-[10px] text-ink-60 font-body">
                                  info@coldeasy.in
                                </span>
                              </div>
                            </a>

                            <a
                              href="https://share.google/LrIPpJB1AfAGYPMW0"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink hover:bg-sand hover:text-leaf transition-colors"
                            >
                              <MapPin className="w-4 h-4 text-marigold shrink-0" />
                              <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold">{t('header.address')}</span>
                                <span className="text-[10px] text-ink-60 font-body">
                                  {t('header.maps')}
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors hover:text-leaf ${
                      active ? 'text-leaf font-bold' : 'text-ink'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-leaf rounded-full" />
                    )}
                  </a>
                );
              })}
            </div>
            <LanguageMenu />
          </div>

          {/* Mobile Right Controls: WhatsApp, Cart, Hamburger */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <a
              href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-leaf hover:bg-leaf-light transition-colors"
              aria-label={t('header.whatsapp')}
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-ink hover:bg-sand transition-colors cursor-pointer"
              aria-label={t('header.cart_count', { count: totalItems })}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <CartCount
                  count={totalItems}
                  className="absolute top-1 right-1 w-4 h-4 bg-leaf text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-ink hover:bg-sand transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? t('header.close_menu') : t('header.open_menu')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[88px] z-50 bg-cream flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Navigation Links */}
              <div className="mb-6">
                <LanguageMenu align="left" onSelect={() => setIsMobileMenuOpen(false)} />
              </div>
              <div className={`flex flex-col space-y-4 font-heading font-semibold text-lg ${navClass}`}>
                {navLinks.map((link) => {
                  const active = isCurrent(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 border-b border-ink/10 ${
                        active ? 'text-leaf font-bold' : 'text-ink'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-5 h-5 text-ink-40" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-ink/10 space-y-3">
              <a
                href="#/track"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-6 rounded-full border border-ink-40 text-ink font-heading font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-sand"
              >
                {t('nav.track')}
              </a>

              <a
                href="#/products/coldeasy-box"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {t('nav.buy_box')}
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-full border border-ink-40 text-ink font-heading font-medium text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-sand"
              >
                <MessageCircle className="w-4 h-4 text-leaf" />
                {t('topbar.connect_wa')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
