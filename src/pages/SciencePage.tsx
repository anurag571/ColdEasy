import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, ShoppingBag, Info, RotateCcw, Activity } from 'lucide-react';
import { SeecAnimationPlayer } from '../components/SeecAnimationPlayer';
import { OptimizedImage } from '../components/OptimizedImage';
import { useLanguage } from '../context/LanguageContext';

const CROP_KEYS = {
  Banana: 'science.crop.banana',
  Tomato: 'science.crop.tomato',
  Mango: 'science.crop.mango',
} as const;

type CropName = keyof typeof CROP_KEYS;

const CROP_PHOTOS: Record<CropName, { fresh: string; ambient: string }> = {
  Tomato: {
    fresh: '/assets/crops/tomato-fresh.webp',
    ambient: '/assets/crops/tomato-ambient.webp',
  },
  Mango: {
    fresh: '/assets/crops/mango-fresh.webp',
    ambient: '/assets/crops/mango-ambient.webp',
  },
  Banana: {
    fresh: '/assets/crops/banana-fresh.webp',
    ambient: '/assets/crops/banana-ambient.webp',
  },
};

function CropPortrait({ crop, fresh, alt }: { crop: CropName; fresh: boolean; alt: string }) {
  return (
    <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-black/10 shadow-lg sm:h-64 sm:w-64">
      <OptimizedImage
        src={CROP_PHOTOS[crop][fresh ? 'fresh' : 'ambient']}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export const SciencePage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<'Banana' | 'Tomato' | 'Mango'>('Tomato');
  const [isColdEasyView, setIsColdEasyView] = useState(false);
  const [selectedLabCrop, setSelectedLabCrop] = useState<'Banana' | 'Tomato' | 'Mango'>('Tomato');

  // Tomato decay time-lapse. Loops while the hero is on screen.
  const tomatoVideoRef = useRef<HTMLVideoElement>(null);
  const tomatoStageRef = useRef<HTMLDivElement>(null);
  const [decayProgress, setDecayProgress] = useState(0);

  const freshnessStages = [
    { id: 'fresh', at: 0, key: 'science.stage.fresh' },
    { id: 'holding', at: 0.34, key: 'science.stage.holding' },
    { id: 'ageing', at: 0.67, key: 'science.stage.ageing' },
  ] as const;

  const activeStage =
    [...freshnessStages].reverse().find((stage) => decayProgress >= stage.at) ?? freshnessStages[0];

  const updateDecayProgress = () => {
    const video = tomatoVideoRef.current;
    if (!video || !video.duration) return;
    setDecayProgress(Math.min(1, video.currentTime / video.duration));
  };

  const startTomatoAnimation = () => {
    const video = tomatoVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  };

  useEffect(() => {
    const stage = tomatoStageRef.current;
    const video = tomatoVideoRef.current;
    if (!stage || !video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const scrollToIntro = () => {
    const el = document.getElementById('science-intro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const section = new URLSearchParams(window.location.hash.split('?')[1] || '').get('section');
    if (section !== 'science-how') return;
    const el = document.getElementById('science-how');
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <div className="w-full bg-cream text-ink">
      {/* =========================================================================
          1. HERO: DARK CINEMATIC SECTION
          Headline: "The Science of Freshness" with "Science" in sky accent
          Subline: "How science keeps your produce fresher for longer."
          Buttons: GET STARTED (ColdEasy Box) & LEARN MORE (smooth scroll)
          Tomato decay time-lapse loops while this hero is on screen
          ========================================================================= */}
      <section className="relative w-full bg-[#14100B] text-[#EDE8DE] py-16 sm:py-24 md:py-28 overflow-hidden border-b border-white/10">
        {/* Ambient atmospheric glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky/15 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headlines & Action Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky text-xs font-heading font-extrabold uppercase tracking-wider mb-4 border border-white/10">
                {t('science.badge')}
              </span>

              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-[58px] text-[#EDE8DE] leading-[1.1] tracking-tight">
                {t('science.title_before')}
                <span className="text-sky">{t('science.title_accent')}</span>
                {t('science.title_after')}
              </h1>

              <p className="mt-4 text-base sm:text-xl text-[#EDE8DE]/90 font-heading font-bold">
                {t('science.sub')}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-[#EDE8DE]/70 font-body max-w-xl leading-relaxed">
                {t('science.body')}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#/products/coldeasy-box"
                  className="py-3.5 px-8 rounded-full bg-leaf text-white font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t('science.cta')}
                </a>

                <button
                  type="button"
                  onClick={scrollToIntro}
                  className="py-3.5 px-7 rounded-full border-2 border-[#EDE8DE]/30 text-[#EDE8DE] font-heading font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                >
                  {t('science.more')}
                </button>
              </div>
            </div>

            {/* Right Column: Tomato decay time-lapse */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                ref={tomatoStageRef}
                className="w-full max-w-[460px] p-4 rounded-[28px] bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xs flex flex-col items-center"
              >
                <div className="w-full flex items-center justify-between text-[11px] font-heading font-bold uppercase tracking-wider text-[#EDE8DE]/60 px-2 pb-2 border-b border-white/10">
                  <span>{t('science.decay')}</span>
                  <span className="text-chilli font-extrabold">{t('science.ambient')}</span>
                </div>

                <div className="relative mt-3 w-full">
                  <video
                    ref={tomatoVideoRef}
                    src="/video/tomato-decaying-timelapse-1080.mp4"
                    className="w-full h-auto block rounded-2xl bg-black/20"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onTimeUpdate={updateDecayProgress}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-3 pt-12">
                    <span className="font-heading text-sm font-bold text-white">{t(activeStage.key)}</span>
                    <div className="relative mx-1 mt-2 h-1.5 rounded-full bg-white/25">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/80"
                        style={{ width: `${decayProgress * 100}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between font-heading text-[10px] font-bold text-white/80">
                      {freshnessStages.map((stage) => (
                        <span key={stage.id} className={stage.id === activeStage.id ? 'text-white' : ''}>
                          {t(stage.key)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 w-full flex justify-end">
                  <button
                    type="button"
                    onClick={startTomatoAnimation}
                    className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-sky hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t('science.replay')}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#EDE8DE]/70 mt-3 text-center max-w-xs">
                {t('science.illustrative')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SCIENCE OF FRESHNESS INTRO
          Centered heading
          The two paragraphs flowing across the page verbatim from requirements
          TODO(client): add a source for the 1.3 billion figure.
          ========================================================================= */}
      <section id="science-intro" className="w-full bg-cream py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px bg-ink/15 flex-1 max-w-[80px]" />
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-ink">
              {t('science.intro_title')}
            </h2>
            <span className="h-px bg-ink/15 flex-1 max-w-[80px]" />
          </div>

          <div className="space-y-6 text-sm sm:text-base text-ink-80 font-body leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
            <p>
              {t('science.intro_1')}
            </p>
            <p>
              {t('science.intro_2')}
            </p>
            {/* TODO(client): add a source for the 1.3 billion figure. */}
          </div>
        </div>
      </section>

      {/* Crop freshness: one board, toggled between ambient storage and ColdEasy Box.
          Figures are the tomato board in the client crop-freshness note. The same
          board is shown for banana and mango; blanks stay "Data to be added". */}
      <section className="w-full bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-[32px] bg-[#F7F3EA] p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-leaf">
                  {t('sci.fresh_kicker')}
                </h2>
                <p className="mt-1 max-w-sm font-body text-sm text-[#5E554E]">
                  {isColdEasyView ? t('sci.fresh_box_sub') : t('sci.fresh_ambient_sub')}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-white/70 p-1">
                {(['Banana', 'Tomato', 'Mango'] as const).map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-heading text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      selectedCrop === crop ? 'bg-leaf text-white' : 'text-[#5E554E] hover:text-[#251A10]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        crop === 'Banana' ? 'bg-marigold' : crop === 'Tomato' ? 'bg-chilli' : 'bg-[#E07A1F]'
                      }`}
                      aria-hidden="true"
                    />
                    {t(CROP_KEYS[crop])}
                  </button>
                ))}
              </div>
            </div>

            <div className="crop-board mt-6 overflow-hidden rounded-[28px] p-5 text-white sm:p-8">
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <h3 className="font-heading text-3xl font-bold sm:text-4xl">
                    {t(CROP_KEYS[selectedCrop])}
                  </h3>
                  <p className="mt-1 font-body text-sm text-white/75">
                    {isColdEasyView ? t('sci.in_box') : t('sci.ambient_storage')}
                  </p>

                  <div className="relative mx-auto mt-6 flex h-72 w-full max-w-md items-center justify-center">
                    <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-white/15" aria-hidden="true" />
                    <CropPortrait
                      crop={selectedCrop}
                      fresh={isColdEasyView}
                      alt={t(isColdEasyView ? 'sci.photo_fresh' : 'sci.photo_ambient', {
                        crop: t(CROP_KEYS[selectedCrop]),
                      })}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black/25 px-3 py-1 font-heading text-[11px] font-bold text-white">
                      {isColdEasyView ? t('sci.index_high') : t('sci.index_low')}
                    </span>
                    <span className="rounded-full bg-black/25 px-3 py-1 font-heading text-[11px] font-bold text-white">
                      {isColdEasyView ? t('sci.firm_high') : t('sci.firm_low')}
                    </span>
                    <span className="rounded-full bg-black/25 px-3 py-1 font-heading text-[11px] font-bold text-white">
                      {isColdEasyView ? t('sci.gloss_note') : t('sci.spoil_note')}
                    </span>
                  </div>

                  <p className="mt-4 font-body text-sm text-white/85">
                    {isColdEasyView ? (
                      <>
                        {t('sci.box_cool')}
                        <span className="mt-1 block text-white/70">{t('sci.zero_power')}</span>
                      </>
                    ) : (
                      t('sci.room_heat')
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                  <div className="rounded-2xl bg-[#F7F4EC] px-4 py-3 text-[#251A10]">
                    <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-[#7A7268]">
                      {t('sci.freshness')}
                    </span>
                    <div className="mt-1 font-heading text-3xl font-semibold leading-none">
                      {t('sci.day_8')} <span className="text-lg">{t('sci.days')}</span>
                    </div>
                    <span className="mt-1 block font-body text-[10px] text-[#8A8176]">{t('sci.days_watch')}</span>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] px-4 py-3 text-[#251A10]">
                    <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-[#7A7268]">
                      {t('sci.marketability')}
                    </span>
                    <div
                      className={
                        isColdEasyView
                          ? 'mt-1 font-heading text-lg font-semibold leading-snug'
                          : 'mt-1 font-heading text-3xl font-semibold leading-none text-chilli'
                      }
                    >
                      {isColdEasyView ? t('sci.data') : t('sci.ambient_market')}
                    </div>
                    <span className="mt-1 block font-body text-[10px] text-[#8A8176]">{t('sci.saleable')}</span>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] px-4 py-3 text-[#251A10]">
                    <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-[#7A7268]">
                      {t('sci.weight')}
                    </span>
                    <div className="mt-1 font-heading text-3xl font-semibold leading-none">—</div>
                    <span className="mt-1 block font-body text-[10px] text-[#8A8176]">{t('sci.data')}</span>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] px-4 py-3 text-[#251A10]">
                    <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-[#7A7268]">
                      {t('sci.ph')}
                    </span>
                    <div className="mt-1 font-heading text-lg font-semibold leading-snug">{t('sci.data')}</div>
                    <span className="mt-1 block font-body text-[10px] text-[#8A8176]">{t('sci.ph_note')}</span>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-[#F7F4EC] px-4 py-3 text-[#251A10]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#7A7268]">
                        {t('sci.firmness')}
                      </span>
                      <span
                        className={`font-heading text-sm font-semibold ${
                          isColdEasyView ? 'text-leaf' : 'text-chilli'
                        }`}
                      >
                        {isColdEasyView ? t('sci.holding') : t('sci.declining')}
                      </span>
                    </div>
                    <div className="relative mt-3 h-1.5 rounded-full bg-gradient-to-r from-leaf via-marigold to-chilli">
                      <span
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#251A10] shadow"
                        style={{ left: isColdEasyView ? '8%' : '78%' }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between font-body text-[10px] text-[#8A8176]">
                      <span>{t('sci.firm')}</span>
                      <span>{t('sci.softening')}</span>
                      <span>{t('sci.overripe')}</span>
                    </div>
                    {!isColdEasyView && (
                      <span className="mt-1 block font-body text-[10px] text-[#8A8176]">{t('sci.turgor')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="max-w-md font-body text-xs text-[#8A8176]">
                {t('sci.figures_note')} {t('sci.photo_credit')}
              </p>
              <button
                type="button"
                onClick={() => setIsColdEasyView((prev) => !prev)}
                className="cursor-pointer rounded-full bg-leaf px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition-transform active:scale-95"
              >
                {isColdEasyView
                  ? t('sci.view_ambient', { crop: t(CROP_KEYS[selectedCrop]) })
                  : `${t('sci.view_box', { crop: t(CROP_KEYS[selectedCrop]) })} →`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. "WHAT HAPPENS WHEN PRODUCE LOSES THE RIGHT ENVIRONMENT?"
          Two pathways:
          - High temperature -> faster respiration, ripening, deterioration
          - Low humidity -> moisture loss, weight loss, wilting
          Converging on: "LOWER QUALITY + SHORTER SELLING WINDOW"
          Then: Farmers and Vendors & Retailers cards
          Ending with: "THE NEED FOR BETTER POST-HARVEST INFRASTRUCTURE"
          ========================================================================= */}
      <section className="w-full bg-white py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-chilli">
              {t('sci.lose_kicker')}
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-ink mt-1">
              {t('sci.lose_title')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-60 font-body mt-2">
              {t('sci.lose_sub')}
            </p>
          </div>

          {/* Two Pathways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pathway 1: High Temperature */}
            <div className="relative p-6 sm:p-8 rounded-[28px] bg-[#FAF7F0] border border-ink/10 shadow-xs flex flex-col justify-between">
              <span
                className="pointer-events-none absolute inset-0 rounded-[28px] border border-chilli/30 animate-science-pulse"
                style={{ animationDelay: '0ms' }}
                aria-hidden="true"
              />
              <div>
                <div className="relative w-12 h-12 mb-4">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-chilli/45 animate-indicator-beacon"
                    style={{ animationDelay: '0ms' }}
                    aria-hidden="true"
                  />
                  <div className="relative w-12 h-12 rounded-2xl bg-chilli-light flex items-center justify-center text-chilli shadow-2xs">
                    <Thermometer className="w-6 h-6 stroke-[2.5]" />
                  </div>
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-chilli">
                  {t('sci.hot')}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.hot_body')}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-ink/10 flex items-center gap-2 text-xs font-heading font-bold text-chilli animate-metric-breath">
                <span>{t('sci.resp')}</span>
                <span>→</span>
                <span>{t('sci.ripe')}</span>
                <span>→</span>
                <span>{t('sci.decay')}</span>
              </div>
            </div>

            {/* Pathway 2: Low Humidity */}
            <div className="relative p-6 sm:p-8 rounded-[28px] bg-[#FAF7F0] border border-ink/10 shadow-xs flex flex-col justify-between">
              <span
                className="pointer-events-none absolute inset-0 rounded-[28px] border border-sky/40 animate-science-pulse"
                style={{ animationDelay: '1200ms' }}
                aria-hidden="true"
              />
              <div>
                <div className="relative w-12 h-12 mb-4">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-sky/55 animate-indicator-beacon"
                    style={{ animationDelay: '1200ms' }}
                    aria-hidden="true"
                  />
                  <div className="relative w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center text-sky shadow-2xs">
                    <Droplets className="w-6 h-6 text-leaf stroke-[2.5]" />
                  </div>
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-leaf">
                  {t('sci.dry')}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.dry_body')}
                </p>
              </div>
              <div
                className="mt-5 pt-4 border-t border-ink/10 flex items-center gap-2 text-xs font-heading font-bold text-leaf animate-metric-breath"
                style={{ animationDelay: '1200ms' }}
              >
                <span>{t('sci.moist')}</span>
                <span>→</span>
                <span>{t('sci.weight')}</span>
                <span>→</span>
                <span>{t('sci.wilt')}</span>
              </div>
            </div>
          </div>

          {/* Converging Banner: LOWER QUALITY + SHORTER SELLING WINDOW */}
          <div className="relative max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-sand text-center border-2 border-chilli/30 shadow-xs">
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-chilli/40 animate-science-pulse"
              style={{ animationDelay: '600ms' }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-ink-60 block">
              {t('sci.converge')}
            </span>
            <div className="mt-2 font-heading font-black text-lg sm:text-2xl text-chilli uppercase tracking-wider">
              {t('sci.converge_line')}
            </div>
          </div>

          {/* Farmers and Vendors & Retailers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
            <div className="p-6 sm:p-7 rounded-[26px] bg-white border-2 border-ink/10 shadow-xs hover:border-leaf/40 transition-colors">
              <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-leaf">
                {t('sci.farm_kicker')}
              </span>
              <h4 className="font-heading font-black text-lg uppercase tracking-wider text-ink mt-1 mb-2">
                {t('sci.farmers')}
              </h4>
              <p className="text-xs sm:text-sm text-ink-60 font-body leading-relaxed">
                {t('sci.farm_body')}
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-[26px] bg-white border-2 border-ink/10 shadow-xs hover:border-marigold/40 transition-colors">
              <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-marigold">
                {t('sci.vendor_kicker')}
              </span>
              <h4 className="font-heading font-black text-lg uppercase tracking-wider text-ink mt-1 mb-2">
                {t('sci.vendors')}
              </h4>
              <p className="text-xs sm:text-sm text-ink-60 font-body leading-relaxed">
                {t('sci.vendor_body')}
              </p>
            </div>
          </div>

          {/* Ending Headline */}
          <div className="mt-12 text-center">
            <span className="inline-block font-heading font-black text-xs sm:text-sm uppercase tracking-widest text-leaf bg-leaf-light px-5 py-2.5 rounded-full border border-leaf/25 shadow-2xs">
              {t('sci.need')}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SOLUTION REVEAL, CENTERED
          Centered:
          "So, How Can We Create a Better Post-Harvest Environment?"
          "ColdEasy Box: Reimagining Post-Harvest Cooling"
          The two paragraphs from the brief, with "ColdEasy takes a different approach."
          and "SEEC" emphasized.
          ========================================================================= */}
      <section className="w-full bg-[#FAF7F0] py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <p className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-ink-60 mb-2">
            {t('sci.ask')}
          </p>

          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-ink mb-8 leading-tight">
            {t('sci.box_title')}
          </h2>

          <div className="space-y-6 text-sm sm:text-base text-ink-80 font-body leading-relaxed max-w-2xl mx-auto">
            <p>
              {t('sci.box_p1')}
            </p>
            <p className="text-base sm:text-lg">
              <strong className="text-leaf font-heading font-bold">{t('sci.box_lead')}</strong>{' '}
              {t('sci.box_p2')}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SEEC TECHNOLOGY
          - Left stacked words:
              Structurally
              Enhanced
              Evaporative
              Cooling
          - Right blocks:
              What is SEEC / How it works / What it achieves / What is it best for?
          - Asterisked note for 10-15°C, 2x, 80% pending verified testing
          - SEEC Technical Blueprint SVG with animated airflow:
              Water tank at BASE, 2 SEEC pads standing in it absorbing upward,
              warm dry air entering through pads, cooling by evaporation,
              leaves through roof vents with ethylene, no fan
          - Closing statement:
              WATER + AIR + ENGINEERING → PASSIVE COOLING
              The physics is simple. The engineering makes it practical.
          ========================================================================= */}
      <section id="science-how" className="w-full bg-white py-16 sm:py-24 border-b border-ink/10 scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-sky">
              {t('sci.seec_kicker')}
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-wider text-ink mt-1">
              {t('sci.seec_title')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-60 font-body mt-2">
              {t('sci.seec_sub')}
            </p>
          </div>

          {/* Left: Huge Stacked Words | Right: Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Left: Huge Stacked Words */}
            <div className="lg:col-span-5 font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight uppercase flex flex-col select-none py-2">
              <span className="text-ink">{t('sci.w_struct')}</span>
              <span className="text-sky">{t('sci.w_enhanced')}</span>
              <span className="text-ink">{t('sci.w_evap')}</span>
              <span className="text-leaf">{t('sci.w_cool')}</span>
            </div>

            {/* Right: What is SEEC / How it works / What it achieves / What is it best for? */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-ink/5 shadow-2xs">
                <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink mb-1">
                  {t('sci.what')}
                </h4>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.what_body')}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-ink/5 shadow-2xs">
                <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink mb-1">
                  {t('sci.how')}
                </h4>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.how_body')}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-ink/5 shadow-2xs">
                <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink mb-1">
                  {t('sci.achieve')}
                </h4>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.achieve_body')}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-ink/5 shadow-2xs">
                <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink mb-1">
                  {t('sci.best')}
                </h4>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed">
                  {t('sci.best_body')}
                </p>
              </div>

              {/* Asterisked Note per brief with subtle attention pulse on thermal & humidity indicators */}
              <div className="relative p-4 rounded-xl bg-sand/80 border border-ink/10 text-[11px] text-ink-60 font-body italic flex items-start gap-2.5">
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl border border-leaf/35 animate-science-pulse"
                  aria-hidden="true"
                />
                <Info className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                <span>{t('sci.note')}</span>
              </div>
            </div>
          </div>

          {/* SEEC TECHNICAL BLUEPRINT WITH ANIMATED AIRFLOW ARROWS */}
          <div className="bg-[#FAF7F0] rounded-[32px] p-6 sm:p-10 border border-ink/10 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-leaf">
                {t('sci.blue')}
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-ink mt-1">
                {t('sci.cycle')}
              </h3>
              <p className="text-xs text-ink-60 font-body max-w-xl mx-auto mt-1">
                {t('sci.cycle_sub')}
              </p>
            </div>

            {/* Interactive SEEC Thermodynamic Airflow Video Player */}
            <div className="w-full max-w-4xl mx-auto">
              <SeecAnimationPlayer />
            </div>

            {/* Closing Statement */}
            <div className="mt-12 text-center max-w-xl mx-auto space-y-2">
              <p className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-leaf">
                {t('sci.formula')}
              </p>
              <p className="text-xs sm:text-sm text-ink-60 font-body">
                {t('sci.simple')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LAB TESTING
          3 Crop Tabs: Banana | Tomato | Mango
          Empty chart placeholders ("{t('sci.data')}") per brief
          ========================================================================= */}
      <section className="w-full bg-sand py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-leaf">
            {t('sci.lab_kicker')}
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-ink mt-1 mb-2">
            {t('sci.lab_title')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-60 font-body mb-8">
            {t('sci.lab_sub')}
          </p>

          {/* 3 Crop Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-ink/10 shadow-2xs mb-10">
            {(['Banana', 'Tomato', 'Mango'] as const).map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setSelectedLabCrop(crop)}
                className={`px-6 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedLabCrop === crop
                    ? 'bg-leaf text-white shadow-xs'
                    : 'text-ink-60 hover:text-ink'
                }`}
              >
                {t(CROP_KEYS[crop])}
              </button>
            ))}
          </div>

          {/* Empty Chart Placeholders per brief ("{t('sci.data')}") with subtle indicator pulses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="relative bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between min-h-[220px]">
              <span
                className="pointer-events-none absolute inset-0 rounded-[24px] border border-chilli/25 animate-science-pulse"
                style={{ animationDelay: '0ms' }}
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-9 h-9">
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl border border-chilli/45 animate-indicator-beacon"
                      style={{ animationDelay: '0ms' }}
                      aria-hidden="true"
                    />
                    <div className="relative w-9 h-9 rounded-xl bg-chilli-light text-chilli flex items-center justify-center">
                      <Thermometer className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                  {t('sci.temp_profile', { crop: t(CROP_KEYS[selectedLabCrop]) })}
                </span>
                <p className="text-xs text-ink-40 font-body mt-1">
                  {t('sci.temp_note')}
                </p>
              </div>
              <div className="h-28 rounded-xl bg-sand/60 border border-dashed border-ink/20 flex flex-col items-center justify-center p-3 text-center my-4">
                <span className="text-xs font-heading font-bold text-ink-60 uppercase tracking-wider">
                  {t('sci.data')}
                </span>
                <span className="text-[10px] text-ink-40 mt-1">// TODO(client): Lab curve</span>
              </div>
              <div className="text-[10px] text-ink-40 text-left font-mono">
                {t('sci.pending')}
              </div>
            </div>

            <div className="relative bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between min-h-[220px]">
              <span
                className="pointer-events-none absolute inset-0 rounded-[24px] border border-sky/35 animate-science-pulse"
                style={{ animationDelay: '700ms' }}
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-9 h-9">
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl border border-sky/55 animate-indicator-beacon"
                      style={{ animationDelay: '700ms' }}
                      aria-hidden="true"
                    />
                    <div className="relative w-9 h-9 rounded-xl bg-sky-light text-sky flex items-center justify-center">
                      <Droplets className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                  {t('sci.rh_profile', { crop: t(CROP_KEYS[selectedLabCrop]) })}
                </span>
                <p className="text-xs text-ink-40 font-body mt-1">
                  {t('sci.rh_note')}
                </p>
              </div>
              <div className="h-28 rounded-xl bg-sand/60 border border-dashed border-ink/20 flex flex-col items-center justify-center p-3 text-center my-4">
                <span className="text-xs font-heading font-bold text-ink-60 uppercase tracking-wider">
                  {t('sci.data')}
                </span>
                <span className="text-[10px] text-ink-40 mt-1">// TODO(client): RH dataset</span>
              </div>
              <div className="text-[10px] text-ink-40 text-left font-mono">
                {t('sci.pending')}
              </div>
            </div>

            <div className="relative bg-white rounded-[24px] p-6 border border-ink/10 shadow-xs flex flex-col justify-between min-h-[220px]">
              <span
                className="pointer-events-none absolute inset-0 rounded-[24px] border border-leaf/30 animate-science-pulse"
                style={{ animationDelay: '1400ms' }}
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-9 h-9">
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl border border-leaf/45 animate-indicator-beacon"
                      style={{ animationDelay: '1400ms' }}
                      aria-hidden="true"
                    />
                    <div className="relative w-9 h-9 rounded-xl bg-leaf-light text-leaf flex items-center justify-center">
                      <Activity className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                  {t('sci.firm_profile', { crop: t(CROP_KEYS[selectedLabCrop]) })}
                </span>
                <p className="text-xs text-ink-40 font-body mt-1">
                  {t('sci.firm_note')}
                </p>
              </div>
              <div className="h-28 rounded-xl bg-sand/60 border border-dashed border-ink/20 flex flex-col items-center justify-center p-3 text-center my-4">
                <span className="text-xs font-heading font-bold text-ink-60 uppercase tracking-wider">
                  {t('sci.data')}
                </span>
                <span className="text-[10px] text-ink-40 mt-1">
                  // TODO(client): Firmness assay
                </span>
              </div>
              <div className="text-[10px] text-ink-40 text-left font-mono">
                {t('sci.pending')}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
