import React, { useState } from 'react';
import { INDIAN_STATES_AND_UTS, FORM_BENEFITS, PRODUCTS } from '../data/mock';
import { SectionHeading } from '../components/SectionHeading';
import { track } from '../lib/track';
import { CheckCircle2, ArrowRight, ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';

export type LeadFormType = 'distributor' | 'partner' | 'affiliate' | 'bulk';

interface LeadFormPageProps {
  formType: LeadFormType;
  initialProductSlug?: string;
}

export const LeadFormPage: React.FC<LeadFormPageProps> = ({ formType, initialProductSlug }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Unified Form State with URL query prefilling for bulk/calculator referrals
  const [formData, setFormData] = useState(() => {
    let initialCrop = 'Tomatoes, Greens and Flowers';
    let initialQty = '5–15 units';
    let initialProd = initialProductSlug || 'coldeasy-box';

    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash || '';
      const [, queryPart] = rawHash.split('?');
      const params = new URLSearchParams(queryPart || window.location.search || '');
      if (params.get('product')) initialProd = params.get('product')!;
      if (params.get('crop')) initialCrop = params.get('crop')!;
      if (params.get('quantity')) initialQty = params.get('quantity')!;
    }

    return {
      // Step 1 / General
      name: '',
      businessName: '',
      contactPerson: '',
      mobile: '',
      email: '',

      // Location
      state: 'Maharashtra',
      district: '',
      pincode: '',
      marketsCovered: '',

      // Capacity / Specifics
      businessType: 'Retail Agriculture Store',
      yearsInBusiness: '1–3 years',
      storageSpace: 'Yes',
      teamSize: '1–5 people',
      monthlyUnits: '10–25 units',
      investmentComfort: '₹1 Lakh – ₹3 Lakhs',
      consentContact: true,

      // Partner specific
      orgType: 'FPO / Farmer Producer Organisation',
      regionOfWork: '',
      partnershipInterest: 'Deployment',
      description: '',

      // Affiliate specific
      platform: 'WhatsApp groups',
      audienceSize: '1,000 – 5,000 members',
      profileLink: '',
      whyColdEasy: '',

      // Bulk specific
      selectedProducts: [initialProd],
      bulkQuantity: initialQty,
      cropsStored: initialCrop,
      preferredContactTime: 'Morning (9 AM – 12 PM)',
    };
  });

  const titles: Record<LeadFormType, { title: string; subtitle: string }> = {
    distributor: {
      title: 'BECOME A DISTRIBUTOR',
      subtitle:
        'Build regional post-harvest cooling distribution across your rural market clusters.',
    },
    partner: {
      title: 'BECOME A PARTNER',
      subtitle:
        'Collaborate with ColdEasy for institutional deployments, CSR funding, and FPO pilots.',
    },
    affiliate: {
      title: 'BECOME AN AFFILIATE PARTNER',
      subtitle:
        'Recommend ColdEasy to your grower network. Commission terms [TBC].',
    },
    bulk: {
      title: 'BULK & FPO ENQUIRY',
      subtitle:
        'Institutional pricing and multi-unit logistics planning for mandis and farmer collectives.',
    },
  };

  const benefits = FORM_BENEFITS[formType];
  const { title, subtitle } = titles[formType];

  // Number of steps per form type
  // Distributor: 4 steps (About you, Location, Capacity, Review & Consent)
  // Partner: 2 steps (Organisation & Contact, Partnership details)
  // Affiliate: 2 steps (About you, Platform & Audience)
  // Bulk: 2 steps (Organisation & Products, Requirements & Delivery)
  const totalSteps = formType === 'distributor' ? 4 : 2;

  // Step indicator dot colors (sky, marigold, chilli, leaf)
  const stepColors = ['bg-sky', 'bg-marigold', 'bg-chilli', 'bg-leaf'];

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    const cleanMobile = formData.mobile.replace(/\D/g, '');

    if (currentStep === 0) {
      if (formType === 'partner') {
        if (!formData.businessName.trim()) errs.businessName = 'Enter organisation name';
        if (!formData.name.trim()) errs.name = 'Enter contact person name';
      } else {
        if (!formData.name.trim()) errs.name = 'Enter your name';
      }
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        errs.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
      }
    }

    if (formType === 'distributor' && currentStep === 1) {
      if (!formData.district.trim()) errs.district = 'Enter district';
      if (!/^\d{6}$/.test(formData.pincode.trim())) errs.pincode = 'PIN code must be 6 digits';
    }

    if (formType === 'distributor' && currentStep === 3) {
      if (!formData.consentContact)
        errs.consent = 'Please agree to be contacted via WhatsApp/phone';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Log to console and save in localStorage under "ce_leads"
    const payload = {
      formType,
      data: formData,
      submittedAt: new Date().toISOString(),
    };

    console.log('[ColdEasy Lead Submission]:', payload);
    track('generate_lead', {
      form_type: formType,
      state: formData.state,
    });

    try {
      const existing = localStorage.getItem('ce_leads');
      const list = existing ? JSON.parse(existing) : [];
      list.push(payload);
      localStorage.setItem('ce_leads', JSON.stringify(list));
    } catch {
      // storage unavailable
    }

    setIsSuccess(true);
  };

  const toggleProductSelect = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(slug);
      if (exists) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter((s) => s !== slug),
        };
      }
      return {
        ...prev,
        selectedProducts: [...prev.selectedProducts, slug],
      };
    });
  };

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <SectionHeading title={title} subtitle={subtitle} isCentered />

        {/* Above Form: "What you get" panel with 3 short benefit points */}
        <div className="mb-8 p-6 rounded-[24px] bg-sand border border-ink/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-leaf" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink">
              What You Get
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl">
                <span className="w-4 h-4 rounded-full bg-leaf text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs text-ink font-medium leading-snug">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-step Form Card */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-ink/10 shadow-md">
          {/* Progress Indicator Dots (sky, marigold, chilli, leaf) */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    i <= currentStep
                      ? stepColors[i % stepColors.length]
                      : 'bg-sand border border-ink/20'
                  }`}
                >
                  {i < currentStep && <span className="text-[9px] font-bold text-ink">✓</span>}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-8 h-1 rounded-full ${i < currentStep ? 'bg-ink' : 'bg-sand'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DISTRIBUTOR FORM STEPS */}
              {formType === 'distributor' && (
                <>
                  {currentStep === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 1: About You
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                        {errors.name && <p className="text-xs text-chilli mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Mobile Number (+91) *
                        </label>
                        <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                          <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="98765 43210"
                            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden font-medium"
                          />
                        </div>
                        {errors.mobile && (
                          <p className="text-xs text-chilli mt-1">{errors.mobile}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="business@domain.com"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Business or Trading Name
                        </label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({ ...formData, businessName: e.target.value })
                          }
                          placeholder="Agro Agencies / Enterprise"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 2: Location
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          State / Union Territory
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden bg-white"
                        >
                          {INDIAN_STATES_AND_UTS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            District *
                          </label>
                          <input
                            type="text"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            placeholder="District name"
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                          />
                          {errors.district && (
                            <p className="text-xs text-chilli mt-1">{errors.district}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder="6-digit PIN code"
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                          />
                          {errors.pincode && (
                            <p className="text-xs text-chilli mt-1">{errors.pincode}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Villages or Mandi Markets Covered
                        </label>
                        <input
                          type="text"
                          value={formData.marketsCovered}
                          onChange={(e) =>
                            setFormData({ ...formData, marketsCovered: e.target.value })
                          }
                          placeholder="e.g. 15 mandis across 2 taluks"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 3: Capacity & Capabilities
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Current Business Type
                          </label>
                          <select
                            value={formData.businessType}
                            onChange={(e) =>
                              setFormData({ ...formData, businessType: e.target.value })
                            }
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>Retail Agri Input Store</option>
                            <option>Wholesale Mandi Commission Agent</option>
                            <option>Farm Machinery / Pump Dealer</option>
                            <option>Solar / Cold Storage Provider</option>
                            <option>Other Rural Trader</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Years in Business
                          </label>
                          <select
                            value={formData.yearsInBusiness}
                            onChange={(e) =>
                              setFormData({ ...formData, yearsInBusiness: e.target.value })
                            }
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>Less than 1 year</option>
                            <option>1–3 years</option>
                            <option>3–7 years</option>
                            <option>7+ years</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Dedicated Storage Space Available?
                          </label>
                          <select
                            value={formData.storageSpace}
                            onChange={(e) =>
                              setFormData({ ...formData, storageSpace: e.target.value })
                            }
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>Yes (Warehouse / Godown)</option>
                            <option>Yes (Retail Shop Front)</option>
                            <option>No (Direct Dispatch Only)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Field Sales Team Size
                          </label>
                          <select
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>1–2 people</option>
                            <option>3–5 people</option>
                            <option>6–15 people</option>
                            <option>15+ staff</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Monthly Units Projected
                          </label>
                          <select
                            value={formData.monthlyUnits}
                            onChange={(e) =>
                              setFormData({ ...formData, monthlyUnits: e.target.value })
                            }
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>5–15 crates / month</option>
                            <option>15–40 crates / month</option>
                            <option>40–100 crates / month</option>
                            <option>100+ crates / month</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Investment Comfort Range
                          </label>
                          <select
                            value={formData.investmentComfort}
                            onChange={(e) =>
                              setFormData({ ...formData, investmentComfort: e.target.value })
                            }
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            <option>₹50,000 – ₹1 Lakh</option>
                            <option>₹1 Lakh – ₹3 Lakhs</option>
                            <option>₹3 Lakhs – ₹10 Lakhs</option>
                            <option>₹10 Lakhs+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 4: Review and Consent
                      </h4>

                      <div className="p-4 rounded-2xl bg-sand/60 border border-ink/10 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-ink-60">Applicant:</span>
                          <span className="font-bold text-ink">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-60">Mobile:</span>
                          <span className="font-bold text-ink">+91 {formData.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-60">Location:</span>
                          <span className="font-bold text-ink">
                            {formData.district}, {formData.state}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-60">Target Volume:</span>
                          <span className="font-bold text-ink">{formData.monthlyUnits}</span>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 p-3 rounded-2xl border border-ink/10 bg-white cursor-pointer min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={formData.consentContact}
                          onChange={(e) =>
                            setFormData({ ...formData, consentContact: e.target.checked })
                          }
                          className="w-5 h-5 accent-leaf rounded mt-0.5"
                        />
                        <span className="text-xs text-ink font-medium leading-relaxed">
                          I consent to being contacted by ColdEasy&apos;s partnership desk on
                          WhatsApp and phone regarding dealership terms and catalog wholesale
                          pricing.
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-chilli">{errors.consent}</p>}
                    </div>
                  )}
                </>
              )}

              {/* PARTNER FORM (2 Steps) */}
              {formType === 'partner' && (
                <>
                  {currentStep === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 1: Organisation & Contact
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Organisation Name *
                        </label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({ ...formData, businessName: e.target.value })
                          }
                          placeholder="FPO / NGO / Institution Name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                        {errors.businessName && (
                          <p className="text-xs text-chilli mt-1">{errors.businessName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Organisation Type
                        </label>
                        <select
                          value={formData.orgType}
                          onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>FPO / Farmer Producer Organisation</option>
                          <option>Agricultural Cooperative</option>
                          <option>NGO / Rural Livelihood Trust</option>
                          <option>CSR Foundation</option>
                          <option>Academic / Research Body</option>
                          <option>Government Agency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Contact Person Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Primary contact name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                        {errors.name && <p className="text-xs text-chilli mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Mobile Number (+91) *
                        </label>
                        <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                          <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="98765 43210"
                            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden font-medium"
                          />
                        </div>
                        {errors.mobile && (
                          <p className="text-xs text-chilli mt-1">{errors.mobile}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 2: Partnership Focus
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Partnership Interest
                        </label>
                        <select
                          value={formData.partnershipInterest}
                          onChange={(e) =>
                            setFormData({ ...formData, partnershipInterest: e.target.value })
                          }
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>Deployment</option>
                          <option>CSR funding</option>
                          <option>Research</option>
                          <option>Distribution</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Region / Districts of Work
                        </label>
                        <input
                          type="text"
                          value={formData.regionOfWork}
                          onChange={(e) =>
                            setFormData({ ...formData, regionOfWork: e.target.value })
                          }
                          placeholder="e.g. Vidarbha, North Karnataka, Anantapur"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Brief Description of Objective
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Describe crop losses, target farmer numbers, or funding scope..."
                          className="w-full p-3 rounded-2xl border border-ink-40/60 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* AFFILIATE FORM (2 Steps) */}
              {formType === 'affiliate' && (
                <>
                  {currentStep === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 1: Your Profile
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full Name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                        {errors.name && <p className="text-xs text-chilli mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Mobile Number (+91) *
                        </label>
                        <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                          <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="98765 43210"
                            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden font-medium"
                          />
                        </div>
                        {errors.mobile && (
                          <p className="text-xs text-chilli mt-1">{errors.mobile}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@domain.com"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 2: Platform & Network
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Primary Platform
                        </label>
                        <select
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>Instagram</option>
                          <option>YouTube</option>
                          <option>WhatsApp groups</option>
                          <option>Offline / Mandi network</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Audience / Community Size
                        </label>
                        <select
                          value={formData.audienceSize}
                          onChange={(e) =>
                            setFormData({ ...formData, audienceSize: e.target.value })
                          }
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>Under 1,000 members</option>
                          <option>1,000 – 5,000 members</option>
                          <option>5,000 – 25,000 followers</option>
                          <option>25,000+ followers</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Channel / Profile Link
                        </label>
                        <input
                          type="url"
                          value={formData.profileLink}
                          onChange={(e) =>
                            setFormData({ ...formData, profileLink: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Why do you want to partner with ColdEasy?
                        </label>
                        <textarea
                          rows={2}
                          value={formData.whyColdEasy}
                          onChange={(e) =>
                            setFormData({ ...formData, whyColdEasy: e.target.value })
                          }
                          placeholder="Tell us about the growers you reach..."
                          className="w-full p-3 rounded-2xl border border-ink-40/60 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* BULK ENQUIRY FORM (2 Steps) */}
              {formType === 'bulk' && (
                <>
                  {currentStep === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 1: Contact & Product Interest
                      </h4>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Organisation / Farm Name *
                        </label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({ ...formData, businessName: e.target.value })
                          }
                          placeholder="FPO / Agri Business Name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                        {errors.name && <p className="text-xs text-chilli mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Mobile Number (+91) *
                        </label>
                        <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                          <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="98765 43210"
                            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden font-medium"
                          />
                        </div>
                        {errors.mobile && (
                          <p className="text-xs text-chilli mt-1">{errors.mobile}</p>
                        )}
                      </div>

                      {/* Products Checkboxes from 6 products */}
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-2">
                          Products Interested In (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PRODUCTS.map((p) => {
                            const isChecked = formData.selectedProducts.includes(p.slug);
                            return (
                              <label
                                key={p.id}
                                className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer min-h-[44px] ${
                                  isChecked
                                    ? 'border-leaf bg-leaf-light/40'
                                    : 'border-ink/10 bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleProductSelect(p.slug)}
                                  className="w-4 h-4 accent-leaf rounded"
                                />
                                <span className="text-xs font-semibold text-ink">{p.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="font-heading font-bold text-base uppercase text-ink">
                        Step 2: Order Requirements
                      </h4>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Estimated Quantity Range
                        </label>
                        <select
                          value={formData.bulkQuantity}
                          onChange={(e) =>
                            setFormData({ ...formData, bulkQuantity: e.target.value })
                          }
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>5–15 units</option>
                          <option>15–50 units</option>
                          <option>50–200 units</option>
                          <option>200+ units</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Crops Stored / Handled
                        </label>
                        <input
                          type="text"
                          value={formData.cropsStored}
                          onChange={(e) =>
                            setFormData({ ...formData, cropsStored: e.target.value })
                          }
                          placeholder="e.g. Tomatoes, Flowers, Leafy Greens"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Delivery State
                          </label>
                          <select
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                          >
                            {INDIAN_STATES_AND_UTS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                            Delivery PIN Code
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder="6-digit PIN"
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          Preferred Contact Time
                        </label>
                        <select
                          value={formData.preferredContactTime}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredContactTime: e.target.value })
                          }
                          className="w-full min-h-[44px] px-4 py-2 rounded-full border border-ink-40/60 text-xs sm:text-sm bg-white"
                        >
                          <option>Morning (9 AM – 12 PM)</option>
                          <option>Afternoon (12 PM – 4 PM)</option>
                          <option>Evening (4 PM – 8 PM)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-ink/10 flex items-center justify-between gap-3">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="min-h-[44px] py-2.5 px-5 rounded-full border border-ink-40 text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="min-h-[44px] py-2.5 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                  >
                    Next Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="min-h-[44px] py-3 px-8 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all cursor-pointer shadow-sm ml-auto"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Success Screen as specified in Prompt 2.5 */
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-leaf text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-xl uppercase tracking-wider text-ink">
                Application Received
              </h4>
              <p className="text-sm text-ink-60 font-body max-w-md mx-auto leading-relaxed">
                Thanks. Our team will contact you on WhatsApp within 1–2 working days.
              </p>
              <div className="pt-4">
                <a
                  href="#/"
                  className="inline-block py-2.5 px-6 rounded-full bg-sand text-ink text-xs font-heading font-semibold uppercase tracking-wider hover:bg-sand/80"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Below Form: WhatsApp "Prefer to talk? Chat with us" link */}
        <div className="mt-8 text-center">
          <a
            href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-leaf hover:underline"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Prefer to talk? Chat with us on WhatsApp (+91 91829 68542)
          </a>
        </div>
      </div>
    </div>
  );
};
