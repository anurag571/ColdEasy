import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  Sparkles,
  Wind,
  Droplets,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

interface StageCallout {
  id: string;
  time: number;
  label: string;
  badge: string;
  title: string;
  description: string;
  colorClass: string;
  badgeBg: string;
}

const STAGES: StageCallout[] = [
  {
    id: 'intake',
    time: 0.5,
    label: '01. Warm Dry Air',
    badge: 'Intake',
    title: 'Lateral Warm Air Intake',
    description:
      'Hot, dry ambient air is drawn in from both lateral flanks through the perforated crate walls.',
    colorClass: 'text-amber-700 border-amber-300 bg-amber-50',
    badgeBg: 'bg-amber-600',
  },
  {
    id: 'wicking',
    time: 2.2,
    label: '02. SEEC Pads & Water',
    badge: 'Evaporation',
    title: 'Capillary Water Wicking & Phase Change',
    description:
      'Water wicks up from the bottom tank into the vertical honeycomb pads. Heat leaves as water evaporates.',
    colorClass: 'text-sky-700 border-sky-300 bg-sky-50',
    badgeBg: 'bg-sky-600',
  },
  {
    id: 'chamber',
    time: 4.5,
    label: '03. Produce Chamber',
    badge: 'Cool & Dry',
    title: 'Chamber Cooled Without Wetting',
    description:
      'Cool, humid air blankets the produce chamber. Harvested fruits & vegetables stay completely dry and chilled.',
    colorClass: 'text-leaf border-leaf/30 bg-leaf-light/40',
    badgeBg: 'bg-leaf',
  },
  {
    id: 'exhaust',
    time: 6.5,
    label: '04. Natural Airflow',
    badge: 'No Fan',
    title: 'Ethylene & Heat Evacuation',
    description:
      'Buoyancy drives warmer exhaust and ripening ethylene gas out of the top chimney naturally with zero electricity.',
    colorClass: 'text-ink-80 border-ink/20 bg-sand',
    badgeBg: 'bg-ink',
  },
];

export const SeecAnimationPlayer: React.FC = () => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(7.93);
  const [activeStageId, setActiveStageId] = useState<string>('intake');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>(
    '/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_720p.mp4',
  );

  // Select video resolution based on window width
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.innerWidth >= 768;
    setVideoSrc(
      isDesktop
        ? '/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_1080p_058f9e4f.mp4'
        : '/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_720p.mp4',
    );
  }, []);

  // Ensure native attributes for mobile autoplay policy
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
  }, []);

  // Sync active stage based on current video timestamp
  useEffect(() => {
    if (currentTime < 2.0) {
      setActiveStageId('intake');
    } else if (currentTime < 4.2) {
      setActiveStageId('wicking');
    } else if (currentTime < 6.2) {
      setActiveStageId('chamber');
    } else {
      setActiveStageId('exhaust');
    }
  }, [currentTime]);

  // Pause when out of viewport, play when in view
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          if (video.paused && isPlaying) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: [0.1, 0.25] },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isPlaying]);

  // Handle keyboard escape for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = true;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = true;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const seekToStage = (stage: StageCallout) => {
    const video = videoRef.current;
    setActiveStageId(stage.id);
    if (!video) return;
    video.currentTime = stage.time;
    video.muted = true;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-[26px] p-4 sm:p-6 border border-ink/10 shadow-sm flex flex-col gap-4 overflow-hidden"
    >
      {/* Top Header Badge & Live Status */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-leaf animate-pulse" />
          <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-ink">
            {t('seec.live')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider text-ink-60">
          <Sparkles className="w-3 h-3 text-sky" />
          <span>{t('seec.cycle')}</span>
        </div>
      </div>

      {/* Main Video Frame (16:9) with Custom Overlay Controls */}
      <div className="relative aspect-video w-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#FAF7F0] border border-ink/10 group shadow-inner">
        <video
          ref={videoRef}
          src={videoSrc}
          poster="/assets/aistudio/seec_thermodynamics_poster.jpg"
          className="w-full h-full object-contain block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-label="Thermodynamic airflow animation showing water wicking up SEEC pads, latent heat absorption, and natural exhaust without fans"
        />

        {/* Top-Right Lightbox Expand Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-ink/70 hover:bg-ink text-white flex items-center justify-center shadow-md transition-all cursor-pointer z-20 group/btn"
          aria-label={t('seec.expand')}
          title="Inspect high-definition schematic"
        >
          <Maximize2 className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
        </button>

        {/* Central Tap-to-Play Overlay if Paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-ink/20 hover:bg-ink/30 transition-colors z-10 cursor-pointer"
            aria-label="Resume animation"
          >
            <div className="w-14 h-14 rounded-full bg-leaf text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
              <Play className="w-6 h-6 ml-0.5 fill-white" />
            </div>
            <span className="mt-2 px-3 py-1 rounded-full bg-ink/75 backdrop-blur-xs text-white text-[11px] font-heading font-semibold uppercase tracking-wider">
              Resume Cycle
            </span>
          </button>
        )}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent p-3 sm:p-4 flex items-center justify-between text-white z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label={isPlaying ? t('seec.pause') : t('seec.play')}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 ml-0.5 fill-white" />
              )}
            </button>

            {/* Replay Button */}
            <button
              type="button"
              onClick={handleReplay}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label={t('seec.restart')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active Stage Indicator */}
            <span className="text-[11px] sm:text-xs font-heading font-semibold tracking-wide ml-1 truncate max-w-[150px] sm:max-w-none">
              {t(`seec.${activeStage.id}.label`)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono text-white/80">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/20 pointer-events-none z-20">
          <div
            className="h-full bg-sky transition-all duration-100 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive 4-Stage Legend Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => seekToStage(stage)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'border-leaf bg-leaf-light/30 shadow-xs'
                  : 'border-ink/10 bg-sand/30 hover:bg-sand/60 hover:border-ink/20 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span
                  className={`text-[9px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                    isActive ? 'bg-leaf text-white' : 'bg-ink/15 text-ink'
                  }`}
                >
                  {t(`seec.${stage.id}.badge`)}
                </span>
                <span className="text-[10px] font-mono text-ink-40">{stage.time}s</span>
              </div>
              <span
                className={`text-[11px] font-heading font-bold mt-1.5 truncate ${
                  isActive ? 'text-leaf' : 'text-ink'
                }`}
              >
                {t(`seec.${stage.id}.label`).replace(/^\d+\.\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Synced Dynamic Explanation Box */}
      <div className="p-3.5 rounded-2xl bg-sand/40 border border-ink/10 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-leaf-light text-leaf flex items-center justify-center shrink-0 mt-0.5">
          {activeStageId === 'intake' && <Wind className="w-4 h-4" />}
          {activeStageId === 'wicking' && <Droplets className="w-4 h-4" />}
          {activeStageId === 'chamber' && <ShieldCheck className="w-4 h-4" />}
          {activeStageId === 'exhaust' && <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div>
          <h5 className="font-heading font-bold text-xs uppercase tracking-wide text-ink">
            {t(`seec.${activeStage.id}.title`)}
          </h5>
          <p className="text-xs text-ink-60 leading-relaxed mt-0.5 font-body">
            {t(`seec.${activeStage.id}.desc`)}
          </p>
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Inspection */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#FAF7F0] rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 border border-white/20 shadow-2xl overflow-hidden flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-leaf">
                  High-Definition Schematic
                </span>
                <h4 className="font-heading font-extrabold text-base sm:text-lg text-ink">
                  ColdEasy Box — Thermodynamic Airflow & SEEC Phase Change
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-sand hover:bg-leaf hover:text-white text-ink flex items-center justify-center transition-colors cursor-pointer"
                aria-label={t('seec.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full-res video */}
            <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-white shadow-md border border-ink/10">
              <video
                src="/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_1080p_058f9e4f.mp4"
                poster="/assets/aistudio/seec_thermodynamics_poster.jpg"
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            </div>

            {/* Modal Footer Note */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ink-60 gap-2 pt-1">
              <span>
                Warm air enters sideways → water evaporates and absorbs heat → chilled air
                circulates → ethylene purges upward.
              </span>
              <span className="font-heading font-bold text-leaf text-xs uppercase shrink-0">
                100% Passive • Zero Electricity
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
