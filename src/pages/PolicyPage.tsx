import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export type PolicyType = 'terms' | 'privacy' | 'refund' | 'shipping';

interface PolicyPageProps {
  type: PolicyType;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
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
      title: 'TERMS & CONDITIONS',
      subtitle:
        'Standard commercial and operational terms governing equipment sales and user interactions.',
      sections: [
        {
          id: 'intro',
          title: '1. Eligibility & Platform Use',
          content: (
            <p>
              By accessing the ColdEasy web platform or placing an order for evaporative cooling
              crates, you confirm that you are at least 18 years of age and competent to enter into
              binding legal agreements under the Indian Contract Act, 1872. These services are
              intended for agricultural producers, street vendors, retailers, and FPO cooperatives
              operating in India.
            </p>
          ),
        },
        {
          id: 'orders',
          title: '2. Orders & Commercial Pricing',
          content: (
            <div className="space-y-2">
              <p>
                All prices listed on the platform are in Indian Rupees (INR) and are inclusive of
                applicable Goods and Services Tax (GST) unless explicitly itemized otherwise.
                ColdEasy reserves the right to revise catalog pricing, batch availability, or
                regional dispatch schedules.
              </p>
              <p>
                Order confirmation occurs upon digital payment receipt or confirmed offline FPO
                booking agreement.
              </p>
            </div>
          ),
        },
        {
          id: 'payments',
          title: '3. Payments & Gateway Settlement',
          content: (
            <p>
              Payments processed online are routed through RBI-authorized payment aggregators (e.g.,
              Razorpay). ColdEasy does not store your debit card, credit card, or netbanking PIN
              credentials on internal servers. For large institutional consignments, RTGS/NEFT
              invoicing is facilitated directly by Temperate Technologies Pvt. Ltd.
            </p>
          ),
        },
        {
          id: 'governing-law',
          title: '4. Governing Law & Jurisdiction',
          content: (
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any
              disputes arising in connection with equipment purchase shall be subject to the
              exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
            </p>
          ),
        },
        {
          id: 'grievance',
          title: '5. Grievance Officer',
          content: (
            <div className="p-4 rounded-2xl bg-sand/60 border border-ink/5 space-y-1">
              <p className="font-semibold text-ink">Grievance Redressal Officer:</p>
              <p className="text-ink-60">Name: Rajesh Sharma (Director of Customer Trust)</p>
              <p className="text-ink-60">Email: grievance@coldeasy.in</p>
              <p className="text-ink-60">Response Time: Within 48 business hours</p>
            </div>
          ),
        },
      ],
    },
    privacy: {
      title: 'PRIVACY POLICY',
      subtitle:
        'How ColdEasy handles customer contact numbers, delivery addresses, and WhatsApp permissions.',
      sections: [
        {
          id: 'intro',
          title: '1. Information We Collect',
          content: (
            <p>
              We collect essential personal data needed to fulfill equipment delivery and coordinate
              rural logistics: full name, Indian mobile number (+91), shipping address, pin code,
              and optional GSTIN for business tax invoices.
            </p>
          ),
        },
        {
          id: 'whatsapp',
          title: '2. WhatsApp Communication & Consent',
          content: (
            <p>
              When you opt-in, we use WhatsApp to transmit dispatch updates, freight tracking
              details, and seasonal harvest maintenance guides. You may opt out of promotional
              broadcasts at any time by replying &quot;STOP&quot; on WhatsApp.
            </p>
          ),
        },
        {
          id: 'retention',
          title: '3. Data Security & Retention',
          content: (
            <p>
              We apply industry-standard encryption protocols. Data is retained for a period of 24
              months to comply with statutory accounting and tax regulations in India. We do not
              sell or lease customer contact lists to third-party telemarketers.
            </p>
          ),
        },
        {
          id: 'grievance',
          title: '4. Privacy Redressal',
          content: (
            <p>
              For queries or data deletion requests, email our data safety desk at
              privacy@coldeasy.in.
            </p>
          ),
        },
      ],
    },
    refund: {
      title: 'REFUND & CANCELLATION POLICY',
      subtitle:
        'Inspection, return conditions, and replacement protocols for agricultural cooling hardware.',
      sections: [
        {
          id: 'intro',
          title: '1. Order Cancellation Window',
          content: (
            <p>
              Orders may be cancelled free of charge prior to warehouse freight dispatch, typically
              within 24 hours of order confirmation. Once crates have been loaded onto interstate
              logistics carriers, standard return policies apply.
            </p>
          ),
        },
        {
          id: 'damaged',
          title: '2. Damaged or Defective Items',
          content: (
            <p>
              In the rare event of transit damage or manufacturing defects in the SEEC pad or crate
              housing, notify ColdEasy on WhatsApp within 48 hours of delivery with clear unboxing
              photographs. We will arrange a free reverse pickup and dispatch a replacement unit
              promptly.
            </p>
          ),
        },
        {
          id: 'returns',
          title: '3. Returns Window',
          content: (
            <p>
              Unused hardware in original packaging may be returned within a return window of 7
              business days from delivery date, subject to verification by our technical inspection
              team.
            </p>
          ),
        },
        {
          id: 'refunds',
          title: '4. Refund Processing Timelines',
          content: (
            <p>
              Approved refunds will be processed to the original payment method (or bank account via
              UPI/NEFT for offline purchases) within 5–7 working days.
            </p>
          ),
        },
      ],
    },
    shipping: {
      title: 'SHIPPING & DELIVERY POLICY',
      subtitle:
        'Logistics routes, freight handling, and expected arrival schedules across Indian agricultural regions.',
      sections: [
        {
          id: 'intro',
          title: '1. Dispatch & Delivery Timelines',
          content: (
            <p>
              Orders are typically packaged and dispatched within 1–2 business days. Delivery across
              tier-1 and tier-2 rural aggregation hubs generally arrives within 3–5 business days
              depending on weather and road transit access.
            </p>
          ),
        },
        {
          id: 'charges',
          title: '2. Shipping Charges & Free Delivery',
          content: (
            <p>
              Standard orders above ₹5,000 qualify for complimentary door or mandi hub delivery.
              Orders below this threshold incur a nominal flat logistics charge of ₹250.
            </p>
          ),
        },
        {
          id: 'unserviceable',
          title: '3. Remote & Mountainous Coverage',
          content: (
            <p>
              Certain remote pin codes (including selected mountain belts and island territories)
              may require special transport coordination. Our team works directly with regional
              transport unions to establish collection point delivery.
            </p>
          ),
        },
        {
          id: 'tracking',
          title: '4. Live Freight Tracking',
          content: (
            <p>
              Customers receive instant WhatsApp notifications with consignee numbers upon dispatch,
              and can monitor freight progression live at{' '}
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
            <strong>Draft structure.</strong> Final text to be supplied by ColdEasy&apos;s legal
            advisor.
          </span>
        </div>

        <SectionHeading title={currentPolicy.title} subtitle={currentPolicy.subtitle} />

        {/* Desktop Layout: Table of Contents on Left, Content on Right */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start mt-8">
          {/* Table of Contents (4 cols) */}
          <div className="col-span-4 sticky top-28 bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink pb-3 border-b border-ink/10 mb-3">
              Table of Contents
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
