import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, ShoppingBag, Info, RotateCcw, Activity } from 'lucide-react';
import { SeecAnimationPlayer } from '../components/SeecAnimationPlayer';
import { useLanguage } from '../context/LanguageContext';

const CROP_KEYS = {
  Banana: 'science.crop.banana',
  Tomato: 'science.crop.tomato',
  Mango: 'science.crop.mango',
} as const;

export const SciencePage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<'Banana' | 'Tomato' | 'Mango'>('Tomato');
  const [isColdEasyView, setIsColdEasyView] = useState(false);
  const [selectedLabCrop, setSelectedLabCrop] = useState<'Banana' | 'Tomato' | 'Mango'>('Tomato');

  // Tomato decay time-lapse (plays once on load, holds the last frame)
  const tomatoVideoRef = useRef<HTMLVideoElement>(null);
  const [decayDay, setDecayDay] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateDecayDay = () => {
    const video = tomatoVideoRef.current;
    if (!video || !video.duration) return;
    const progress = Math.min(1, video.currentTime / video.duration);
    setDecayDay(Math.min(8, Math.floor(1 + progress * 7)));
  };

  const startTomatoAnimation = () => {
    const video = tomatoVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = true;
    video
      .play()
      .then(() => setIsAnimating(true))
      .catch(() => setIsAnimating(false));
  };

  useEffect(() => {
    const video = tomatoVideoRef.current;
    if (!video) return;
    video.muted = true;
    const playOnce = () => {
      video.play().then(() => setIsAnimating(true)).catch(() => {});
    };
    if (video.readyState >= 2) playOnce();
    else video.addEventListener('loadeddata', playOnce, { once: true });
    return () => video.removeEventListener('loadeddata', playOnce);
  }, []);

  const scrollToIntro = () => {
    const el = document.getElementById('science-intro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-cream text-ink">
      {/* =========================================================================
          1. HERO: DARK CINEMATIC SECTION
          Headline: "The Science of Freshness" with "Science" in sky accent
          Subline: "How science keeps your produce fresher for longer."
          Buttons: GET STARTED (ColdEasy Box) & LEARN MORE (smooth scroll)
          Tomato decay time-lapse (plays once on load, holds last frame)
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
              <div className="w-full max-w-[380px] p-4 rounded-[28px] bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xs flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[11px] font-heading font-bold uppercase tracking-wider text-[#EDE8DE]/60 px-2 pb-2 border-b border-white/10">
                  <span>{t('science.decay')}</span>
                  <span className="text-chilli font-extrabold">{t('science.ambient')}</span>
                </div>

                <div className="py-2 flex items-center justify-center relative w-full">
                  <video
                    ref={tomatoVideoRef}
                    src="/video/tomato-decaying-timelapse-1080.mp4"
                    className="w-full h-auto block rounded-2xl bg-black/20"
                    muted
                    playsInline
                    preload="auto"
                    onTimeUpdate={updateDecayDay}
                    onPlay={() => setIsAnimating(true)}
                    onEnded={() => {
                      setIsAnimating(false);
                      setDecayDay(8);
                    }}
                  />
                </div>

                <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#EDE8DE]/70 font-body">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-leaf" />
                    <span>Fresh Harvest</span>
                  </div>
                  <span className="text-center font-mono text-[11px] text-[#EDE8DE]/90">
                    Day {decayDay} of 8
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-chilli" />
                    <span className="text-chilli font-semibold">Over-Ripe</span>
                  </div>
                </div>

                {/* Subdued Replay Trigger */}
                <div className="mt-3 pt-2 border-t border-white/5 w-full flex items-center justify-between">
                  <span className="text-[10px] text-[#EDE8DE]/40 italic">
                    Plays once on load, holds final frame
                  </span>
                  <button
                    type="button"
                    onClick={startTomatoAnimation}
                    disabled={isAnimating}
                    className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-sky hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                    title="Replay decay simulation"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#EDE8DE]/50 mt-3 italic text-center max-w-xs">
                Ambient water-weight loss: [TBC].
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

      {/* =========================================================================
          3. CROP FRESHNESS DASHBOARD
          Crop selector: Banana | Tomato | Mango
          Large tomato visual with floating data cards over it
          Ambient Day 8: Freshness "8 Days", Marketability "~13%" gauge,
          Weight Loss "—", pH "{t('sci.data')}", Firmness "Declining"
          Toggle button "VIEW TOMATOES IN COLDEASY BOX ->" flips values to "—" /
          "{t('sci.data')}", and button becomes "VIEW AMBIENT RESULTS ->"
          Never invent numeric ColdEasy data!
          ========================================================================= */}
      <section className="w-full bg-[#F4EFE6] py-16 sm:py-24 border-b border-ink/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-leaf">
              {t('science.dashboard_kicker')}
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-wider text-ink mt-1">
              {t('science.dashboard_title')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-60 font-body mt-1">
              {t('science.dashboard_sub')}
            </p>

            {/* Crop Selector: Banana | Tomato | Mango */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-ink/10 shadow-2xs mt-6">
              {(['Banana', 'Tomato', 'Mango'] as const).map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-6 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCrop === crop
                      ? 'bg-leaf text-white shadow-xs'
                      : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  {t(CROP_KEYS[crop])}
                </button>
              ))}
            </div>
          </div>

          {/* Large Visual Card with Floating Data Cards Over It */}
          <div className="relative bg-white rounded-[32px] p-6 sm:p-10 border border-ink/10 shadow-md overflow-hidden max-w-4xl mx-auto">
            {/* Top Toggle Row */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isColdEasyView ? 'bg-leaf' : 'bg-chilli animate-pulse'
                  }`}
                />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink">
                  Storage Condition:{' '}
                  {isColdEasyView ? 'ColdEasy Box' : 'Ambient (Room Heat, 30°C+)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsColdEasyView((prev) => !prev)}
                className="py-2.5 px-5 rounded-full bg-ink text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isColdEasyView ? 'VIEW AMBIENT RESULTS ->' : 'VIEW TOMATOES IN COLDEASY BOX ->'}
              </button>
            </div>

            {/* Visual Center with Floating Metric Overlays */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left: Large Visual Representation of Selected Crop */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
                <div className="relative">
                  {/* Subtle ambient thermal/cooling breathing halo */}
                  <div
                    className={`pointer-events-none absolute -inset-2 rounded-full border-2 animate-science-pulse ${
                      isColdEasyView ? 'border-sky/40' : 'border-chilli/30'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-[#FAF7F0] border-2 border-ink/10 p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden group">
                    {/* Visual Rendering based on Crop */}
                    {selectedCrop === 'Tomato' ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-md">
                          {/* Shadow */}
                          <ellipse cx="100" cy="175" rx="65" ry="14" fill="rgba(0,0,0,0.12)" />
                          {/* Tomato Body */}
                          <circle
                            cx="100"
                            cy="105"
                            r="68"
                            fill={isColdEasyView ? '#E52E26' : '#6B221B'}
                            className="transition-colors duration-500"
                          />
                          {/* Highlights / Shading */}
                          {isColdEasyView ? (
                            <ellipse
                              cx="76"
                              cy="80"
                              rx="18"
                              ry="9"
                              transform="rotate(-30 76 80)"
                              fill="rgba(255,255,255,0.4)"
                            />
                          ) : (
                            <path
                              d="M 80 120 Q 100 135 125 120"
                              stroke="#33100B"
                              strokeWidth="2.5"
                              fill="none"
                            />
                          )}
                          {/* Calyx */}
                          <polygon
                            points="100,32 94,48 80,42 90,54 75,65 92,67 92,80 100,70 108,80 108,67 125,65 110,54 120,42 106,48"
                            fill={isColdEasyView ? '#487537' : '#735B3A'}
                          />
                          <circle
                            cx="100"
                            cy="58"
                            r="5"
                            fill={isColdEasyView ? '#3B632D' : '#574328'}
                          />
                        </svg>
                      </div>
                    ) : selectedCrop === 'Banana' ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-md">
                          <ellipse cx="100" cy="175" rx="60" ry="12" fill="rgba(0,0,0,0.12)" />
                          {/* Banana Curve */}
                          <path
                            d="M 50 140 Q 90 170 150 110 Q 155 70 130 50 Q 80 100 50 140 Z"
                            fill={isColdEasyView ? '#F0A023' : '#5A4621'}
                            className="transition-colors duration-500"
                          />
                          <path
                            d="M 130 50 L 140 40"
                            stroke="#3E2723"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-md">
                          <ellipse cx="100" cy="175" rx="60" ry="12" fill="rgba(0,0,0,0.12)" />
                          {/* Mango Kidney Shape */}
                          <path
                            d="M 100 45 C 145 45 165 90 155 130 C 145 165 90 175 75 145 C 60 115 65 50 100 45 Z"
                            fill={isColdEasyView ? '#FFA000' : '#614820'}
                            className="transition-colors duration-500"
                          />
                          <circle cx="98" cy="40" r="4" fill="#3E2723" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-white border border-ink/10 text-[11px] font-heading font-extrabold uppercase text-ink shadow-xs">
                      {selectedCrop} {isColdEasyView ? '· In ColdEasy' : '· Ambient Day 8'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Floating Data Cards Over It with Staggered Subtle Pulse */}
              <div className="md:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Freshness */}
                <div className="relative p-4 rounded-2xl bg-[#FAF7F0] border border-ink/10 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-2xl border animate-science-pulse ${
                      isColdEasyView ? 'border-sky/40' : 'border-leaf/30'
                    }`}
                    style={{ animationDelay: '0ms' }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                    Freshness
                  </span>
                  <div
                    className="mt-1 font-heading font-extrabold text-2xl text-ink tabular-nums animate-metric-breath"
                    style={{ animationDelay: '0ms' }}
                  >
                    {isColdEasyView ? '—' : '[TBC]'}
                  </div>
                  <span className="text-[10px] text-ink-40 font-body">
                    {isColdEasyView ? t('sci.data') : t('sci.days_watch')}
                  </span>
                </div>

                {/* 2. Marketability Gauge */}
                <div className="relative p-4 rounded-2xl bg-[#FAF7F0] border border-ink/10 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-2xl border animate-science-pulse ${
                      isColdEasyView ? 'border-sky/40' : 'border-chilli/40'
                    }`}
                    style={{ animationDelay: '450ms' }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                      Marketability
                    </span>
                    {/* Visual Radial Mini Gauge with subtle beacon */}
                    <div className="relative w-7 h-7 flex items-center justify-center">
                      {!isColdEasyView && (
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full border border-chilli/50 animate-indicator-beacon"
                          style={{ animationDelay: '450ms' }}
                          aria-hidden="true"
                        />
                      )}
                      <svg viewBox="0 0 28 28" className="w-7 h-7 -rotate-90" aria-hidden="true">
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-ink/10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={`mt-1 font-heading font-extrabold text-2xl tabular-nums animate-metric-breath ${
                      isColdEasyView ? 'text-ink' : 'text-chilli'
                    }`}
                    style={{ animationDelay: '450ms' }}
                  >
                    {isColdEasyView ? '—' : '[TBC]'}
                  </div>
                  <span className="text-[10px] text-ink-40 font-body">
                    {isColdEasyView ? t('sci.data') : t('sci.saleable')}
                  </span>
                </div>

                {/* 3. Weight Loss */}
                <div className="relative p-4 rounded-2xl bg-[#FAF7F0] border border-ink/10 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-sky/35 animate-science-pulse"
                    style={{ animationDelay: '900ms' }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                    Weight Loss
                  </span>
                  <div
                    className="mt-1 font-heading font-extrabold text-2xl text-ink tabular-nums animate-metric-breath"
                    style={{ animationDelay: '900ms' }}
                  >
                    —
                  </div>
                  <span className="text-[10px] text-ink-40 font-body">{t('sci.data')}</span>
                </div>

                {/* 4. pH */}
                <div className="relative p-4 rounded-2xl bg-[#FAF7F0] border border-ink/10 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-leaf/30 animate-science-pulse"
                    style={{ animationDelay: '1350ms' }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                    pH Level
                  </span>
                  <div
                    className="mt-1 font-heading font-semibold text-base text-ink animate-metric-breath"
                    style={{ animationDelay: '1350ms' }}
                  >
                    {t('sci.data')}
                  </div>
                  <span className="text-[10px] text-ink-40 font-body">Acidity retention assay</span>
                </div>

                {/* 5. Firmness */}
                <div className="relative col-span-2 p-4 rounded-2xl bg-[#FAF7F0] border border-ink/10 shadow-2xs flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-2xl border animate-science-pulse ${
                      isColdEasyView ? 'border-sky/40' : 'border-chilli/35'
                    }`}
                    style={{ animationDelay: '1800ms' }}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60 block">
                      Fruit Firmness
                    </span>
                    <div
                      className={`mt-0.5 font-heading font-bold text-base animate-metric-breath ${
                        isColdEasyView ? 'text-ink' : 'text-chilli'
                      }`}
                      style={{ animationDelay: '1800ms' }}
                    >
                      {isColdEasyView ? '—' : 'Declining'}
                    </div>
                  </div>
                  <span className="text-xs text-ink-40 font-body">
                    {isColdEasyView ? t('sci.data') : t('sci.turgor')}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Audit Footer */}
            <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-40 font-body">
              <span>
                // TODO(client): ColdEasy numeric testing figures to be added upon laboratory
                verification.
              </span>
              <span className="font-heading font-semibold text-leaf">Zero electricity</span>
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
      <section className="w-full bg-white py-16 sm:py-24 border-b border-ink/10">
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
