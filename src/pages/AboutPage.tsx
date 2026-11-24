import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { TEAM_MEMBERS } from '../data/mock';
import { PartnerEcosystem } from '../components/PartnerEcosystem';
import milestonesData from '../content/milestones.json';
import { MessageCircle, ShoppingBag, Linkedin, Compass, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ROLE_KEYS: Record<string, string> = {
  'PM – New Product Development': 'team.role.npd',
  'PM – R&D': 'team.role.rnd',
  Engineer: 'team.role.engineer',
  'Impact and Partnerships Manager': 'team.role.impact',
  "Marketing & Founder's Office": 'team.role.marketing',
  Technician: 'team.role.technician',
};

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

const journeyMilestones = [...(milestonesData as Milestone[])].sort((a, b) => {
  const aTime = Date.parse(a.date);
  const bTime = Date.parse(b.date);
  const aDated = !Number.isNaN(aTime);
  const bDated = !Number.isNaN(bTime);
  if (aDated && bDated && aTime !== bTime) return aTime - bTime;
  if (aDated && !bDated) return -1;
  if (!aDated && bDated) return 1;
  return a.order - b.order;
});

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="w-full bg-cream">
      {/* 1. HERO */}
      <section className="w-full bg-cream py-14 sm:py-20 border-b border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold-light text-ink text-xs font-heading font-bold uppercase tracking-wider mb-4">
            {t('about.badge')}
          </span>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink uppercase tracking-tight leading-tight">
            {t('about.headline')}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ink-60 font-body leading-relaxed max-w-2xl mx-auto">
            {t('about.intro')}
          </p>
        </div>
      </section>

      {/* 2. VISION AND MISSION (Exact copy from client brief) */}
      <section className="w-full bg-white py-16 border-b border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision */}
            <div className="p-8 rounded-[24px] bg-sand/60 border border-ink/10 flex flex-col justify-between hover:border-leaf/30 transition-all shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 text-leaf shadow-2xs border border-ink/5">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl uppercase tracking-wider text-ink mb-3">
                  {t('about.vision_title')}
                </h3>
                <p className="text-sm sm:text-base text-ink-80 leading-relaxed font-body">
                  {t('about.vision')}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-[24px] bg-sand/60 border border-ink/10 flex flex-col justify-between hover:border-leaf/30 transition-all shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 text-leaf shadow-2xs border border-ink/5">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl uppercase tracking-wider text-ink mb-3">
                  {t('about.mission_title')}
                </h3>
                <p className="text-sm sm:text-base text-ink-80 leading-relaxed font-body">
                  {t('about.mission')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEAM: 11 Members */}
      <section className="w-full bg-cream py-16 md:py-24 border-b border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <SectionHeading
            title={t('about.team_title')}
            subtitle={t('about.team_sub')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-[24px] p-2.5 sm:p-3 border border-ink/10 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-leaf/30 transition-all group"
              >
                <div>
                  <div className="w-full aspect-[588/640] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-[#E9A93A] mb-3.5 relative shadow-inner">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-md bg-[#0A66C2] text-white flex items-center justify-center shadow-md hover:bg-[#004182] transition-transform hover:scale-110 z-10"
                        title={`${member.name} on LinkedIn`}
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <Linkedin className="w-4 h-4 fill-current" />
                      </a>
                    )}
                  </div>

                  <div className="px-1.5 pb-2">
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-ink tracking-tight">
                      {member.name}
                    </h4>
                    <p className="text-xs text-ink-60 mt-0.5 font-body font-medium leading-snug">
                      {ROLE_KEYS[member.role] ? t(ROLE_KEYS[member.role]) : member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. JOURNEY TIMELINE, from src/content/milestones.json */}
      <section className="w-full bg-white py-16 md:py-24 border-b border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <SectionHeading title="OUR JOURNEY" subtitle="[TBC]" />

          {/* Desktop Horizontal Timeline */}
          <div className="hidden lg:block relative mt-12 mb-8">
            <div
              className="absolute top-7 left-8 right-8 h-1.5 rounded-full overflow-hidden flex -z-0"
              aria-hidden="true"
            >
              <span className="w-1/4 h-full bg-sky" />
              <span className="w-1/4 h-full bg-marigold" />
              <span className="w-1/4 h-full bg-chilli" />
              <span className="w-1/4 h-full bg-leaf" />
            </div>

            <div
              className="grid gap-6 relative z-10"
              style={{
                gridTemplateColumns: `repeat(${journeyMilestones.length}, minmax(0, 1fr))`,
              }}
            >
              {journeyMilestones.map((item, idx) => (
                <div key={item.id} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-ink flex items-center justify-center font-heading font-extrabold text-xs text-ink shadow-sm mb-4">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span className="font-heading font-bold text-sm text-leaf">{item.date}</span>
                  <span className="font-heading font-semibold text-xs text-ink mt-1">
                    {item.title}
                  </span>
                  <p className="text-xs text-ink-60 mt-2 font-body leading-relaxed">
                    {item.description}
                  </p>
                  {item.image && item.image !== '[TBC]' && (
                    <img
                      src={item.image}
                      alt=""
                      className="mt-3 w-full aspect-[4/3] object-cover rounded-xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden relative pl-6 space-y-8 mt-6">
            <div
              className="absolute top-0 bottom-0 left-2 w-1.5 rounded-full overflow-hidden flex flex-col -z-0"
              aria-hidden="true"
            >
              <span className="w-full h-1/4 bg-sky" />
              <span className="w-full h-1/4 bg-marigold" />
              <span className="w-full h-1/4 bg-chilli" />
              <span className="w-full h-1/4 bg-leaf" />
            </div>

            {journeyMilestones.map((item, idx) => (
              <div key={item.id} className="relative pl-6">
                <div className="absolute -left-[23px] top-0 w-6 h-6 rounded-full bg-white border-2 border-ink flex items-center justify-center font-heading font-bold text-[10px] text-ink">
                  {idx + 1}
                </div>
                <span className="font-heading font-bold text-xs text-leaf">{item.date}</span>
                <span className="font-heading font-semibold text-xs text-ink ml-2">
                  {item.title}
                </span>
                <p className="text-xs text-ink-60 mt-1 font-body">{item.description}</p>
                {item.image && item.image !== '[TBC]' && (
                  <img
                    src={item.image}
                    alt=""
                    className="mt-2 w-full max-w-xs aspect-[4/3] object-cover rounded-xl"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerEcosystem />

      {/* 6. CTA BAND */}
      <section className="w-full bg-cream py-14">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-ink mb-4">
            Ready to bring ColdEasy to your region?
          </h2>
          <p className="text-xs sm:text-sm text-ink-60 max-w-md mx-auto mb-8 font-body">
            Get in touch directly or view our product catalog.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#/products"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              View Products
            </a>

            <a
              href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full border-2 border-ink text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-leaf" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
