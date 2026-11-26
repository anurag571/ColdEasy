import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY } from '../content/company';

export type PolicyType = 'terms' | 'privacy' | 'refund' | 'shipping';

interface PolicyPageProps {
  type: PolicyType;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>('intro');

  const policyMeta: Record<
    PolicyType,
    {
      title: string;
      subtitle: string;
      sections: { id: string; title: string; content: React.ReactNode }[];
    }
  > = {
    terms: {
      title: t('policy.terms.title'),
      subtitle:
        t('policy.terms.sub'),
      sections: [
        {
          id: 'intro',
          title: t('policy.terms.1.t'),
          content: (
            <p>
              {t('policy.terms.1.p')}
            </p>
          ),
        },
        {
          id: 'orders',
          title: t('policy.terms.2.t'),
          content: (
            <div className="space-y-2">
              <p>
                {t('policy.terms.2.p1')}
              </p>
              <p>
                {t('policy.terms.2.p2')}
              </p>
            </div>
          ),
        },
        {
          id: 'payments',
          title: t('policy.terms.3.t'),
          content: (
            <p>
              {t('policy.terms.3.p')}
            </p>
          ),
        },
        {
          id: 'governing-law',
          title: t('policy.terms.4.t'),
          content: (
            // TODO(client): lawyer to confirm jurisdiction
            <p>
              {t('policy.terms.4.p')}
            </p>
          ),
        },
        {
          id: 'grievance',
          title: t('policy.terms.5.t'),
          content: (
            <div className="p-4 rounded-2xl bg-sand/60 border border-ink/5 space-y-1">
              <p className="font-semibold text-ink">{t('policy.terms.5.role')}</p>
              <p className="text-ink">{COMPANY.grievanceOfficer.name}</p>
              <p className="text-ink-60">{COMPANY.grievanceOfficer.designation}</p>
              <p>
                <a
                  href={`mailto:${COMPANY.grievanceOfficer.email}`}
                  className="text-leaf underline underline-offset-2"
                >
                  {COMPANY.grievanceOfficer.email}
                </a>
              </p>
              <p>
                <a href={`tel:${COMPANY.phoneTel}`} className="text-leaf underline underline-offset-2">
                  {COMPANY.grievanceOfficer.phoneDisplay}
                </a>
              </p>
              <p className="text-ink-60">{t('policy.terms.5.time')}</p>
            </div>
          ),
        },
      ],
    },
    privacy: {
      title: t('policy.privacy.title'),
      subtitle:
        t('policy.privacy.sub'),
      sections: [
        {
          id: 'intro',
          title: t('policy.privacy.1.t'),
          content: (
            <p>
              {t('policy.privacy.1.p')}
            </p>
          ),
        },
        {
          id: 'whatsapp',
          title: t('policy.privacy.2.t'),
          content: (
            <p>
              {t('policy.privacy.2.p')}
            </p>
          ),
        },
        {
          id: 'retention',
          title: t('policy.privacy.3.t'),
          content: (
            <p>
              {t('policy.privacy.3.p')}
            </p>
          ),
        },
        {
          id: 'grievance',
          title: t('policy.privacy.4.t'),
          content: (
            <div className="space-y-2">
              <p>{t('policy.privacy.4.p')}</p>
              <p>
                {t('policy.privacy.4.officer', {
                  name: COMPANY.grievanceOfficer.name,
                  email: COMPANY.grievanceOfficer.email,
                })}
              </p>
            </div>
          ),
        },
      ],
    },
    refund: {
      title: t('policy.refund.title'),
      subtitle:
        t('policy.refund.sub'),
      sections: [
        {
          id: 'intro',
          title: t('policy.refund.1.t'),
          content: (
            <p>
              {t('policy.refund.1.p')}
            </p>
          ),
        },
        {
          id: 'damaged',
          title: t('policy.refund.2.t'),
          content: (
            <p>
              {t('policy.refund.2.p')}
            </p>
          ),
        },
        {
          id: 'returns',
          title: t('policy.refund.3.t'),
          content: (
            <p>
              {t('policy.refund.3.p')}
            </p>
          ),
        },
        {
          id: 'refunds',
          title: t('policy.refund.4.t'),
          content: (
            <p>
              {t('policy.refund.4.p')}
            </p>
          ),
        },
      ],
    },
    shipping: {
      title: t('policy.ship.title'),
      subtitle:
        t('policy.ship.sub'),
      sections: [
        {
          id: 'intro',
          title: t('policy.ship.1.t'),
          content: (
            <p>
              {t('policy.ship.1.p')}
            </p>
          ),
        },
        {
          id: 'charges',
          title: t('policy.ship.2.t'),
          content: (
            <p>
              {t('policy.ship.2.p')}
            </p>
          ),
        },
        {
          id: 'unserviceable',
          title: t('policy.ship.3.t'),
          content: (
            <p>
              {t('policy.ship.3.p')}
            </p>
          ),
        },
        {
          id: 'tracking',
          title: t('policy.ship.4.t'),
          content: (
            <p>
              {t('policy.ship.4.p')}{' '}
              <a href="#/track" className="text-leaf font-bold underline">
                #/track
              </a>
              .
            </p>
          ),
        },
      ],
    },
  };

  const currentPolicy = policyMeta[type];

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Banner at top of each page */}
        <div className="mb-8 p-3.5 rounded-2xl bg-sand border border-ink/10 flex items-center justify-center gap-2.5 text-center text-xs text-ink font-body">
          <AlertCircle className="w-4 h-4 text-marigold shrink-0" />
          <span>
            {t('policy.draft')}
          </span>
        </div>

        <SectionHeading title={currentPolicy.title} subtitle={currentPolicy.subtitle} />

        {/* Desktop Layout: {t('policy.toc')} on Left, Content on Right */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start mt-8">
          {/* {t('policy.toc')} (4 cols) */}
          <div className="col-span-4 sticky top-28 bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink pb-3 border-b border-ink/10 mb-3">
              {t('policy.toc')}
            </h4>
            <nav className="space-y-1">
              {currentPolicy.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-heading font-semibold transition-colors cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-leaf-light text-leaf'
                      : 'text-ink-60 hover:text-ink hover:bg-sand'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Policy Sections (8 cols) */}
          <div className="col-span-8 space-y-6">
            {currentPolicy.sections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className="bg-white rounded-[24px] p-6 sm:p-8 border border-ink/10 shadow-xs"
              >
                <h3 className="font-heading font-bold text-base uppercase text-ink mb-3">
                  {sec.title}
                </h3>
                <div className="text-xs sm:text-sm text-ink-60 leading-relaxed font-body">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-3 mt-6">
          {currentPolicy.sections.map((sec) => {
            const isOpen = openMobileAccordion === sec.id;
            return (
              <div
                key={sec.id}
                className="bg-white rounded-[20px] border border-ink/10 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenMobileAccordion(isOpen ? null : sec.id)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="font-heading font-bold text-xs uppercase text-ink pr-2">
                    {sec.title}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-ink-60 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-60 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-ink-60 leading-relaxed font-body border-t border-ink/5 mt-1">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
