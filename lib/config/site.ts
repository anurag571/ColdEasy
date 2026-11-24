/**
 * Site facts used in more than one place. Every value here is either confirmed in the build
 * pack or marked [TBC] with the row that will confirm it. Do not add a number, a name or a
 * link that is not in docs/ or confirmed by ColdEasy.
 */
export const site = {
  name: 'ColdEasy',
  /** docs/04 §7 rule 10. 11:B-07: confirm it is a WhatsApp Business number someone answers. */
  whatsappE164: '+919182968542',
  phoneDisplay: '+91 91829 68542',
  email: 'info@coldeasy.in',
  /** 11:B-06. Only Instagram is confirmed. LinkedIn, Facebook and YouTube are [TBC]. */
  social: {
    instagram: 'https://www.instagram.com/coldeasyglobal/',
  } as Record<string, string>,
} as const;

/** Main navigation as it stands (11:B-04 asks ColdEasy to approve it). */
export const mainNav = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.products', href: '/products' },
  { key: 'nav.science', href: '/science' },
  { key: 'nav.impact', href: '/impact' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
] as const;

export const partnerNav = [
  { key: 'footer.partner.distributor', href: '/partner/distributor' },
  { key: 'footer.partner.partner', href: '/partner/partner' },
  { key: 'footer.partner.affiliate', href: '/partner/affiliate' },
] as const;

export const legalNav = [
  { key: 'footer.legal.terms', href: '/legal/terms' },
  { key: 'footer.legal.privacy', href: '/legal/privacy' },
  { key: 'footer.legal.refunds', href: '/legal/refunds' },
  { key: 'footer.legal.shipping', href: '/legal/shipping' },
] as const;

/**
 * Routes that exist but whose page is built in a later phase. They render a clearly marked
 * "being built" page on staging, so links and the link checker work from day one, and return
 * 404 in production until the real page ships.
 */
export const plannedRoutes: Record<string, { titleKey: string; phase: string }> = {
  '/products': { titleKey: 'nav.products', phase: 'Phase 3' },
  '/impact': { titleKey: 'nav.impact', phase: 'Phase 7' },
  '/about': { titleKey: 'nav.about', phase: 'Phase 7' },
  '/contact': { titleKey: 'nav.contact', phase: 'Phase 5' },
  '/cart': { titleKey: 'header.cart', phase: 'Phase 4' },
  '/partner/distributor': { titleKey: 'footer.partner.distributor', phase: 'Phase 5' },
  '/partner/partner': { titleKey: 'footer.partner.partner', phase: 'Phase 5' },
  '/partner/affiliate': { titleKey: 'footer.partner.affiliate', phase: 'Phase 5' },
  '/legal/terms': { titleKey: 'footer.legal.terms', phase: 'Phase 8' },
  '/legal/privacy': { titleKey: 'footer.legal.privacy', phase: 'Phase 8' },
  '/legal/refunds': { titleKey: 'footer.legal.refunds', phase: 'Phase 8' },
  '/legal/shipping': { titleKey: 'footer.legal.shipping', phase: 'Phase 8' },
};
