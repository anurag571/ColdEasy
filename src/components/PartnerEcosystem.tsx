import React, { useEffect, useRef, useState } from 'react';
import partnersFile from '../content/partners.json';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'funding', label: 'Funding & grants' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'government', label: 'Government programmes' },
  { id: 'research', label: 'Research' },
  { id: 'csr', label: 'CSR' },
] as const;

type CategoryId = (typeof TABS)[number]['id'];

interface Partner {
  name: string;
  category: string[];
  logo: string;
  url?: string;
  mayLink?: boolean;
  permission?: string;
  published?: boolean;
  government?: boolean;
}

const partners = (partnersFile.partners ?? []) as Partner[];

export function partnerCategoryFromHash(hash: string): CategoryId {
  const match = hash.match(/partners-(all|deployment|funding|ecosystem|government|research|csr)/);
  const id = match?.[1];
  return TABS.some((tab) => tab.id === id) ? (id as CategoryId) : 'all';
}

function partnerHash(id: CategoryId) {
  return `#/about/partners-${id}`;
}

export const PartnerEcosystem: React.FC = () => {
  const { t } = useLanguage();
  const [category, setCategory] = useState<CategoryId>(() =>
    partnerCategoryFromHash(window.location.hash),
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const skipScroll = useRef(false);

  useEffect(() => {
    const sync = () => setCategory(partnerCategoryFromHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    if (!window.location.hash.includes('partners-')) return;
    document.getElementById('partners')?.scrollIntoView({ block: 'start' });
  }, [category]);

  const selectCategory = (id: CategoryId) => {
    skipScroll.current = true;
    setCategory(id);
    const next = partnerHash(id);
    if (window.location.hash !== next) window.location.hash = next;
    document.getElementById(`partner-tab-${id}`)?.focus();
  };

  const listed = partners.filter(
    (partner) => partner.published !== false && Boolean(partner.name) && partner.name !== '[TBC]',
  );

  const tabs = TABS.filter(
    (tab) => tab.id === 'all' || listed.some((partner) => partner.category.includes(tab.id)),
  );
  const active = tabs.some((tab) => tab.id === category) ? category : 'all';

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectCategory(tabs[next].id);
  };

  const visible =
    active === 'all'
      ? listed
      : listed.filter((partner) => partner.category.some((item) => item.toLowerCase() === active));

  const tiles =
    visible.length > 0
      ? visible.map((partner, index) => ({
          key: `${partner.name}-${index}`,
          name: partner.name,
          logo: partner.logo,
          url: partner.mayLink === false ? undefined : partner.url,
          showLogo:
            Boolean(partner.logo) &&
            Boolean(partner.permission) &&
            partner.permission !== '[TBC]' &&
            !partner.government,
        }))
      : [];

  const loop = reducedMotion ? tiles : [...tiles, ...tiles];

  return (
    <section id="partners" className="w-full bg-sand py-16 border-b border-ink/5 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-ink uppercase tracking-wider">
            Partner ecosystem
          </h2>
          <p className="mt-2 text-ink-60 text-sm sm:text-base">{t('partners.subtitle')}</p>
        </div>

        <div
          role="tablist"
          aria-label="Organisation categories"
          className="flex flex-wrap justify-center gap-2"
          onKeyDown={onTabKeyDown}
        >
          {tabs.map((tab) => {
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                id={`partner-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="partner-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectCategory(tab.id)}
                className={`min-h-11 px-4 py-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 ${
                  selected
                    ? 'bg-leaf text-white border-leaf'
                    : 'bg-white text-ink border-ink/10 hover:border-leaf'
                }`}
              >
                {t(`partners.tab.${tab.id}`)}
              </button>
            );
          })}
        </div>

        <div
          id="partner-panel"
          role="tabpanel"
          aria-labelledby={`partner-tab-${active}`}
          className="mt-6"
        >
          {tiles.length === 0 && (
            <p className="rounded-[24px] bg-white border border-ink/10 p-5 text-center text-sm text-ink-60 font-body sm:p-6">
              {t('common.coming_soon')}
            </p>
          )}
        {loop.length > 0 && (
        <div
          className="partner-marquee overflow-hidden rounded-[24px] bg-white border border-ink/10 py-6"
          aria-label="Organisations"
        >
          <div
            className={`flex items-center gap-4 px-6 ${reducedMotion ? 'flex-wrap justify-center' : 'partner-marquee-track w-max'}`}
            style={reducedMotion ? undefined : { animationDuration: `${Math.max(48, tiles.length * 4)}s` }}
          >
            {loop.map((tile, index) => {
              const chip = tile.showLogo ? (
                <img
                  src={tile.logo}
                  alt={tile.name}
                  width={180}
                  height={72}
                  loading="lazy"
                  className="h-14 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
                />
              ) : (
                <span className="flex h-14 max-w-[16rem] items-center justify-center rounded-2xl border border-ink/10 bg-sand px-4 text-center font-heading text-sm font-bold leading-snug text-ink">
                  {tile.name}
                </span>
              );
              const hidden = !reducedMotion && index >= tiles.length;
              return tile.url ? (
                <a
                  key={`${tile.key}-${index}`}
                  href={tile.url}
                  aria-hidden={hidden || undefined}
                  className="shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                >
                  {chip}
                </a>
              ) : (
                <div key={`${tile.key}-${index}`} aria-hidden={hidden || undefined} className="shrink-0">
                  {chip}
                </div>
              );
            })}
          </div>
        </div>
        )}
        </div>
      </div>
    </section>
  );
};
