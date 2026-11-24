import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { IMPACT_METRICS, TESTIMONIAL_STORIES } from '../data/mock';
import { Leaf, TrendingUp, Users, ShieldCheck, BookOpen, ArrowRight, X } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes('resources')) {
      const el = document.getElementById('resources');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <div className="w-full bg-cream text-ink">
      {/* 1. HERO: "Cooling for a Resilient Future" */}
      <section className="w-full bg-[#FAF7F0] py-14 sm:py-20 md:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf-light text-leaf text-xs font-heading font-extrabold uppercase tracking-wider mb-4 border border-leaf/20">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
              Impact & Ecological Resilience
            </span>

            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-ink uppercase tracking-tight leading-[1.1]">
              Cooling for a Resilient Future
            </h1>

            <p className="mt-4 text-base sm:text-xl text-leaf font-heading font-bold">
              Affordable cooling that helps people protect produce, strengthen incomes and build
              resilience.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-ink-60 font-body max-w-2xl mx-auto leading-relaxed">
              Decentralized evaporative cooling placed at farm gates, aggregation sheds, and
              roadside stalls eliminates post-harvest deterioration where infrastructure is weakest.
            </p>
          </div>
        </div>
      </section>

      {/* 2. IMPACT AT A GLANCE (4 METRICS, ONE ROW) */}
      <section className="w-full bg-white py-14 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-heading font-extrabold text-xs uppercase tracking-widest text-ink-60">
              Impact At A Glance
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="bg-[#FAF7F0] rounded-[24px] p-6 text-center border border-ink/10 shadow-xs flex flex-col items-center justify-center min-h-[140px]"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-leaf tracking-tight">
                  {metric.value}
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink-60 mt-1.5">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY IT MATTERS: "Food loss is income loss." */}
      <section className="w-full bg-sand py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-leaf block">
                The Economic Reality
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-wider text-ink leading-tight">
                Food loss is income loss.
              </h2>
              <p className="text-sm sm:text-base text-ink-70 font-body leading-relaxed">
                When ambient heat wilts and softens harvested vegetables within hours, smallholder
                growers and micro-vendors face an immediate penalty: forced price markdowns or total
                discard.
              </p>
              <p className="text-sm sm:text-base text-ink-70 font-body leading-relaxed">
                Without electricity-free cooling options at harvest points, farmers cannot wait for
                fair pricing, and street vendors absorb losses daily from shrinkage. Decentralizing
                cooling directly at the point of sale converts potential waste into reliable,
                protected household earnings.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Genuine photo placeholder per brief */}
              <div className="w-full max-w-md bg-white rounded-[28px] p-4 border border-ink/10 shadow-md">
                <div className="aspect-[4/3] rounded-2xl bg-sand/60 border border-dashed border-ink/20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-leaf-light flex items-center justify-center text-leaf font-bold mb-2">
                    CE
                  </div>
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink">
                    Field Deployment Photography
                  </span>
                  <span className="text-[11px] text-ink-40 mt-1 font-body">
                    Vegetable retailer market stall with ColdEasy Box crate
                  </span>
                  <span className="text-[10px] text-ink-40 mt-2 font-mono">
                    // TODO(client): Verified field deployment photo
                  </span>
                </div>
                <p className="mt-3 text-center text-xs text-ink-60 font-body">
                  Empowering smallholder retailers to retain harvest freshness throughout the day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE PILLARS (Sustainability, Economic Resilience & Livelihoods, Agency & Equity) */}
      <section className="w-full bg-white py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-ink">
              Our Three Pillars of Impact
            </h2>
            <p className="text-xs sm:text-sm text-ink-60 font-body mt-1">
              Engineered to drive ecological, financial, and community agency simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Sustainability */}
            <div className="p-7 rounded-[26px] bg-[#FAF7F0] border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-leaf-light flex items-center justify-center text-leaf mb-5">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-ink mb-2">
                  1. Sustainability
                </h3>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  Operates with zero chemical refrigerants, zero ozone-depleting gasses, and zero
                  reliance on fossil fuel generators. Evaporative cooling uses natural
                  thermodynamics to drastically reduce the carbon footprint of post-harvest
                  logistics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/10 text-xs font-bold text-leaf font-heading uppercase">
                Clean Thermal Physics
              </div>
            </div>

            {/* Pillar 2: Economic Resilience & Livelihoods */}
            <div className="p-7 rounded-[26px] bg-[#FAF7F0] border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-marigold-light flex items-center justify-center text-ink mb-5">
                  <TrendingUp className="w-6 h-6 text-leaf" />
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-ink mb-2">
                  2. Economic Resilience & Livelihoods
                </h3>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  Protecting crop quality extends selling windows from hours into days. Farmers
                  avoid mid-day panic selling, and micro-vendors avoid steep afternoon price
                  discounts, protecting take-home margins and household security.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/10 text-xs font-bold text-leaf font-heading uppercase">
                Income Protection
              </div>
            </div>

            {/* Pillar 3: Agency & Equity */}
            <div className="p-7 rounded-[26px] bg-[#FAF7F0] border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center text-ink mb-5">
                  <Users className="w-6 h-6 text-sky" />
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-ink mb-2">
                  3. Agency & Equity
                </h3>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  Decentralized, low-cost hardware places cooling capacity directly into the hands
                  of women vendors, smallholders, and rural collectives who are excluded from
                  capital-intensive industrial cold rooms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/10 text-xs font-bold text-leaf font-heading uppercase">
                Decentralized Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE PEOPLE BEHIND THE NUMBERS (Verified Stories) */}
      <section className="w-full bg-[#FAF7F0] py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <SectionHeading
            title="THE PEOPLE BEHIND THE NUMBERS"
            subtitle="Verified deployment accounts from local retailers, growers, and collectives."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIAL_STORIES.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-[26px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-2xl bg-sand/60 border border-ink/10 flex flex-col items-center justify-center p-4 text-center mb-4">
                    <span className="text-xs font-heading font-extrabold uppercase text-ink">
                      {story.customerName}
                    </span>
                    <span className="text-[11px] text-ink-40 mt-1 font-body">{story.location}</span>
                    <span className="text-[9px] text-ink-40 mt-2 font-mono">
                      // TODO(client): photo
                    </span>
                  </div>

                  <span className="text-xs font-bold text-leaf uppercase tracking-wider block">
                    {story.fpoRole}
                  </span>
                  <span className="text-xs text-ink-60 block mt-0.5 font-medium">{story.crop}</span>

                  <blockquote className="mt-3 text-xs text-ink-70 italic font-body leading-relaxed">
                    {story.quote}
                  </blockquote>
                </div>

                <div className="mt-5 pt-3 border-t border-ink/10">
                  <a
                    href={`#/story/${story.id}`}
                    className="text-xs font-heading font-bold uppercase tracking-wider text-leaf hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read full story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW WE MEASURE: "Explore our methodology & Impact Thesis" */}
      <section className="w-full bg-white py-16 border-b border-ink/10">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-ink mb-3">
            How We Measure
          </h2>
          <p className="text-xs sm:text-sm text-ink-60 font-body max-w-xl mx-auto mb-8 leading-relaxed">
            Every metric reported by ColdEasy is gathered through direct baseline and endline
            surveys conducted with participating vendors, mandis, and farmer producer collectives.
          </p>

          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="py-3.5 px-8 rounded-full bg-ink text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-ink/85 transition-all shadow-md cursor-pointer"
          >
            Explore our methodology & Impact Thesis →
          </button>
        </div>
      </section>

      {/* 7. RESOURCES ANCHOR (Where footer Resources link & Know More links land) */}
      <section
        id="resources"
        className="w-full bg-sand py-16 sm:py-24 border-b border-ink/10 scroll-mt-20"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <SectionHeading
            title="RESOURCES & DEPLOYMENT ARCHIVES"
            subtitle="Field documentation, technical research whitepapers, and deployment briefs."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-leaf-light flex items-center justify-center text-leaf mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm uppercase text-ink">
                  SEEC Thermodynamic Overview
                </h3>
                <p className="mt-2 text-xs text-ink-60 font-body leading-relaxed">
                  Technical whitepaper outlining the principles of passive evaporation and relative
                  humidity retention in produce crates.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink/10 text-xs text-ink-40 font-heading font-semibold">
                // TODO(client): Download PDF link
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-light flex items-center justify-center text-sky mb-4">
                  <ShieldCheck className="w-5 h-5 text-leaf" />
                </div>
                <h3 className="font-heading font-bold text-sm uppercase text-ink">
                  Mandi Vendor Freshness Baseline
                </h3>
                <p className="mt-2 text-xs text-ink-60 font-body leading-relaxed">
                  Field observations on daily vegetable weight loss, afternoon distress discounting,
                  and retailer earnings stabilization.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink/10 text-xs text-ink-40 font-heading font-semibold">
                // TODO(client): Download PDF link
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-marigold-light flex items-center justify-center text-ink mb-4">
                  <Users className="w-5 h-5 text-leaf" />
                </div>
                <h3 className="font-heading font-bold text-sm uppercase text-ink">
                  FPO Decentralized Cold Chain Guide
                </h3>
                <p className="mt-2 text-xs text-ink-60 font-body leading-relaxed">
                  Deployment handbook for farmer producer organizations seeking low-cost, off-grid
                  harvest collection points.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink/10 text-xs text-ink-40 font-heading font-semibold">
                // TODO(client): Download PDF link
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FIELD DEPLOYMENT SUMMARY & PHOTO GALLERIES */}
      <section className="w-full bg-white py-16 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-ink">
              Verified Deployments Across Key Agricultural Corridors
            </h2>
            <p className="text-xs text-ink-60 font-body mt-1">
              Active pilots across Bihar, Maharashtra, Karnataka, and Andhra Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-sand/50 text-center border border-ink/5">
              <span className="font-heading font-bold text-base text-ink block">Bihar</span>
              <span className="text-[11px] text-ink-60 font-body">Retail Vegetable Mandis</span>
            </div>
            <div className="p-4 rounded-2xl bg-sand/50 text-center border border-ink/5">
              <span className="font-heading font-bold text-base text-ink block">Maharashtra</span>
              <span className="text-[11px] text-ink-60 font-body">Cut Flowers & Vegetables</span>
            </div>
            <div className="p-4 rounded-2xl bg-sand/50 text-center border border-ink/5">
              <span className="font-heading font-bold text-base text-ink block">
                Andhra Pradesh
              </span>
              <span className="text-[11px] text-ink-60 font-body">Tomato Harvest Collectives</span>
            </div>
            <div className="p-4 rounded-2xl bg-sand/50 text-center border border-ink/5">
              <span className="font-heading font-bold text-base text-ink block">Karnataka</span>
              <span className="text-[11px] text-ink-60 font-body">Smallholder Farm Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. STAKEHOLDER AGENCY & FPO ALIGNMENT */}
      <section className="w-full bg-[#FAF7F0] py-14 border-b border-ink/10">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-leaf block mb-1">
            Community Centered
          </span>
          <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-ink mb-3">
            Designed for Grower Autonomy
          </h3>
          <p className="text-xs sm:text-sm text-ink-70 font-body max-w-xl mx-auto leading-relaxed">
            By avoiding costly centralized subscription models and electricity dependence, ColdEasy
            enables farmers and micro-retailers to own their cold chain and preserve crop value
            independently.
          </p>
        </div>
      </section>

      {/* 10. FINAL CTA: "Help us take affordable cooling further." */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-wider text-ink mb-3">
            Help us take affordable cooling further.
          </h2>
          <p className="text-xs sm:text-sm text-ink-60 font-body max-w-md mx-auto mb-8">
            Join our mission to eliminate post-harvest losses and build resilient, sustainable rural
            food systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#/products"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-md text-center"
            >
              Deploy ColdEasy
            </a>

            <a
              href="#/partner/partner"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full border-2 border-ink text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all text-center"
            >
              Partner with us
            </a>

            <a
              href="#/contact"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full border-2 border-ink text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all text-center"
            >
              Contact our team
            </a>
          </div>
        </div>
      </section>

      {/* Methodology Modal */}
      {isMethodologyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsMethodologyOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-ink-60 hover:text-ink hover:bg-sand cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-xl uppercase tracking-wider text-ink mb-2">
              Our Methodology & Impact Thesis
            </h3>
            <p className="text-xs sm:text-sm text-ink-60 font-body mb-6">
              How we evaluate shelf life extension, distress sales prevention, and vendor income
              stabilization.
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-ink-70 font-body">
              <div className="p-4 rounded-xl bg-sand/50 border border-ink/5">
                <strong className="block text-ink font-heading uppercase text-xs mb-1">
                  Baseline Field Mapping
                </strong>
                Structured tracking of ambient daily temperatures, vendor produce intake weights,
                and mid-day spoilage discard volumes.
              </div>

              <div className="p-4 rounded-xl bg-sand/50 border border-ink/5">
                <strong className="block text-ink font-heading uppercase text-xs mb-1">
                  Controlled Harvest Comparison
                </strong>
                Produce batches divided equally between standard open-crate handling and ColdEasy
                SEEC passive evaporative crates.
              </div>

              <div className="p-4 rounded-xl bg-sand/50 border border-ink/5">
                <strong className="block text-ink font-heading uppercase text-xs mb-1">
                  Economic Realization Tracking
                </strong>
                Measuring evening distress price deductions, percentage of produce retained for
                next-day premium sale, and net income delta.
              </div>

              <p className="text-[11px] text-ink-40 italic mt-4">
                // TODO(client): Comprehensive verified Impact Thesis report link
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
