import React, { useEffect, useRef, useState } from 'react';
import partnersFile from '../content/partners.json';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'finance', label: 'Finance' },
  { id: 'research', label: 'Research' },
  { id: 'csr', label: 'CSR' },
  { id: 'ecosystem', label: 'Ecosystem' },
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
}

const partners = (partnersFile.partners ?? []) as Partner[];

export function partnerCategoryFromHash(hash: string): CategoryId {
  const match = hash.match(/partners-(all|deployment|finance|research|csr|ecosystem)/);
  const id = match?.[1];
  return TABS.some((tab) => tab.id === id) ? (id as CategoryId) : 'all';
}

function partnerHash(id: CategoryId) {
  return `#/about/partners-${id}`;
}

export const PartnerEcosystem: React.FC = () => {
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

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((tab) => tab.id === category);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TABS.length - 1;
    else return;
    event.preventDefault();
    selectCategory(TABS[next].id);
  };

  const confirmed = partners.filter(
    (partner) =>
      partner.published !== false &&
      Boolean(partner.permission) &&
      partner.permission !== '[TBC]' &&
      Boolean(partner.name) &&
      partner.name !== '[TBC]' &&
      Boolean(partner.logo),
  );

  const visible =
    category === 'all'
      ? confirmed
      : confirmed.filter((partner) =>
          partner.category.some((item) => item.toLowerCase() === category),
        );

  const tiles =
    visible.length > 0
      ? visible.map((partner, index) => ({
          key: `${partner.name}-${index}`,
          name: partner.name,
          logo: partner.logo,
          url: partner.mayLink === false ? undefined : partner.url,
        }))
      : Array.from({ length: 6 }, (_, index) => ({
          key: `tbc-${index}`,
          name: '[TBC]',
          logo: '/partners/tbc.svg',
          url: undefined as string | undefined,
        }));

  const loop = reducedMotion ? tiles : [...tiles, ...tiles];

  return (
    <section id="partners" className="w-full bg-sand py-16 border-b border-ink/5 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-ink uppercase tracking-wider">
            Partner ecosystem
          </h2>
          <p className="mt-2 text-ink-60 text-sm sm:text-base">[TBC]</p>
        </div>

        <div
          role="tablist"
          aria-label="Partner categories"
          className="flex flex-wrap justify-center gap-2"
          onKeyDown={onTabKeyDown}
        >
          {TABS.map((tab) => {
            const selected = category === tab.id;
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
                className={`min-h-11 px-4 py-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider cursor-pointer border ${
                  selected
                    ? 'bg-leaf text-white border-leaf'
                    : 'bg-white text-ink border-ink/10 hover:border-leaf'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id="partner-panel"
          role="tabpanel"
          aria-labelledby={`partner-tab-${category}`}
          className="mt-6 rounded-[24px] bg-white border border-ink/10 p-5 sm:p-6 text-center"
        >
          <p className="text-sm text-ink-60 font-body">[TBC]</p>
        </div>

        <div
          className="partner-marquee mt-6 overflow-hidden rounded-[24px] bg-white border border-ink/10 py-6"
          aria-label="Partner logos"
        >
          <div className={`flex items-center gap-8 px-6 ${reducedMotion ? 'flex-wrap justify-center' : 'partner-marquee-track w-max'}`}>
            {loop.map((tile, index) => {
              const image = (
                <img
                  src={tile.logo}
                  alt={tile.name}
                  width={180}
                  height={72}
                  loading="lazy"
                  className="h-14 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
                />
              );
              return tile.url ? (
                <a
                  key={`${tile.key}-${index}`}
                  href={tile.url}
                  className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf rounded-xl"
                >
                  {image}
                </a>
              ) : (
                <div key={`${tile.key}-${index}`} className="shrink-0">
                  {image}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
