import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SectionHeading } from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { track } from '../lib/track';
import { VIDEO_SOURCES, HOW_IT_WORKS_STEPS, HARDWARE_VIDEO_DURATION } from '../data/mock';
import { Play, Pause, RotateCcw, Box, Wind, Sparkles } from 'lucide-react';

export interface HowItWorksSectionProps {
  mode?: 'full' | 'compact';
  topColor?: string;
  bottomColor?: string;
  className?: string;
}

export type ViewPerspective = 'hardware' | 'airflow';

interface AirflowStep {
  id: number;
  start: number;
  end: number;
  title: string;
  badge: string;
  description: string;
}

const AIRFLOW_STEPS: AirflowStep[] = [
  {
    id: 1,
    start: 0,
    end: 2.0,
    title: 'Lateral Warm Air Intake',
    badge: 'Ambient Inflow',
    description:
      'Hot, dry ambient air is drawn in through lateral louvers on both flanks of the crate.',
  },
  {
    id: 2,
    start: 2.0,
    end: 4.2,
    title: 'Capillary Water Wicking & Phase Change',
    badge: 'Latent Heat Evaporation',
    description:
      'Tap water wicks up through honeycomb SEEC media. Water evaporates, extracting heat molecules.',
  },
  {
    id: 3,
    start: 4.2,
    end: 6.2,
    title: 'Cooled Produce Chamber',
    badge: 'Fresh & 100% Dry',
    description:
      'Chilled, high-humidity air blankets fruits and vegetables without ever wetting them directly.',
  },
  {
    id: 4,
    start: 6.2,
    end: 7.93,
    title: 'Natural Chimney Exhaust',
    badge: 'Zero Fan Airflow',
    description:
      'Thermal buoyancy exhausts warm air and ripening ethylene gas out of the top chimney.',
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  mode = 'full',
  topColor = '#F5F3EC',
  bottomColor = '#FFFFFF',
  className = '',
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [viewPerspective, setViewPerspective] = useState<ViewPerspective>('hardware');

  const resolveCurrentSource = useCallback((perspective: ViewPerspective) => {
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    if (perspective === 'hardware') {
      return isDesktop ? VIDEO_SOURCES.video1080 : VIDEO_SOURCES.video720;
    }
    return isDesktop
      ? '/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_1080p_058f9e4f.mp4'
      : '/assets/aistudio/Animate_evaporative_cooling_box___9d0ea1a5_720p.mp4';
  }, []);

  const [videoSrc, setVideoSrc] = useState<string>(() => resolveCurrentSource('hardware'));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(HARDWARE_VIDEO_DURATION);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);

  // Ensure native DOM properties for reliable playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
  }, []);

  // Handle switching perspective tabs
  const handlePerspectiveChange = (perspective: ViewPerspective) => {
    if (perspective === viewPerspective) return;
    setIsUserPaused(false);
    setViewPerspective(perspective);
    const newSrc = resolveCurrentSource(perspective);
    setVideoSrc(newSrc);
    setCurrentTime(0);
    setIsEnded(false);
    setDuration(perspective === 'hardware' ? HARDWARE_VIDEO_DURATION : 7.93);

    const video = videoRef.current;
    if (video) {
      video.src = newSrc;
      video.currentTime = 0;
      video.muted = true;
      video.defaultMuted = true;
      video.load();
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    track('video_step_click', { context: perspective });
  };

  // Compute active step based on current playback time and perspective
  const currentHardwareStepIndex = HOW_IT_WORKS_STEPS.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  );
  const currentHardwareStep =
    currentHardwareStepIndex !== -1
      ? HOW_IT_WORKS_STEPS[currentHardwareStepIndex]
      : currentTime >= HOW_IT_WORKS_STEPS[HOW_IT_WORKS_STEPS.length - 1].start
        ? HOW_IT_WORKS_STEPS[HOW_IT_WORKS_STEPS.length - 1]
        : HOW_IT_WORKS_STEPS[0];

  const currentAirflowStepIndex = AIRFLOW_STEPS.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  );
  const currentAirflowStep =
    currentAirflowStepIndex !== -1
      ? AIRFLOW_STEPS[currentAirflowStepIndex]
      : currentTime >= 6.2
        ? AIRFLOW_STEPS[AIRFLOW_STEPS.length - 1]
        : AIRFLOW_STEPS[0];

  const currentStepTitle =
    viewPerspective === 'hardware' ? currentHardwareStep.title : currentAirflowStep.title;
  const currentStepDesc =
    viewPerspective === 'hardware'
      ? currentHardwareStep.description
      : currentAirflowStep.description;
  const currentStepNum =
    viewPerspective === 'hardware'
      ? currentHardwareStepIndex !== -1
        ? currentHardwareStepIndex + 1
        : 1
      : currentAirflowStepIndex !== -1
        ? currentAirflowStepIndex + 1
        : 1;
  const totalSteps =
    viewPerspective === 'hardware' ? HOW_IT_WORKS_STEPS.length : AIRFLOW_STEPS.length;

  const progressPct = Math.min(100, (currentTime / duration) * 100);

  // Start playback helper
  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    if (!video.src && !video.currentSrc) {
      const selectedSrc = resolveCurrentSource(viewPerspective);
      setVideoSrc(selectedSrc);
      video.src = selectedSrc;
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsEnded(false);
          if (!hasStartedPlaying) {
            setHasStartedPlaying(true);
            track('video_start', { perspective: viewPerspective });
          }
        })
        .catch((err) => {
          console.warn('[HowItWorksVideo] Play blocked:', err);
        });
    }
  }, [hasStartedPlaying, resolveCurrentSource, viewPerspective]);

  // Autoplay on mount / intersection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          if (!isEnded && !isUserPaused && !isPlaying) {
            startPlayback();
          }
        } else if (!entry.isIntersecting) {
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: [0.1, 0.3] },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isEnded, isUserPaused, isPlaying, startPlayback]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isEnded) {
      setIsUserPaused(false);
      handleReplay();
      return;
    }

    if (video.paused) {
      setIsUserPaused(false);
      startPlayback();
    } else {
      video.pause();
      setIsPlaying(false);
      setIsUserPaused(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleVideoEnded = () => {
    if (viewPerspective === 'airflow') {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }
    setIsPlaying(false);
    setIsEnded(true);
    track('video_complete');
  };

  const handleReplay = () => {
    const video = videoRef.current;
    setIsEnded(false);
    if (!video) return;
    video.muted = true;
    video.currentTime = 0;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        track('video_start', { context: 'replay' });
      })
      .catch(() => {});
  };

  const jumpToStep = (startSec: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = startSec;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const currentPoster = '/video/coldeasy-box-exploded-poster.jpg';
  const featheredMaskStyle: React.CSSProperties = {
    WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, #000 70%, transparent 100%)',
    maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, #000 70%, transparent 100%)',
  };

  // ==========================================
  // COMPACT MODE (FOR PRODUCT PAGE)
  // ==========================================
  if (mode === 'compact') {
    return (
      <div
        className={`w-full bg-white rounded-[28px] p-6 border border-ink/10 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-ink">
            How ColdEasy Works
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePerspectiveChange('hardware')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all ${
                viewPerspective === 'hardware' ? 'bg-leaf text-white' : 'bg-sand text-ink-60'
              }`}
            >
              Hardware
            </button>
            <button
              type="button"
              onClick={() => handlePerspectiveChange('airflow')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all ${
                viewPerspective === 'airflow' ? 'bg-sky text-ink' : 'bg-sand text-ink-60'
              }`}
            >
              Airflow
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-ink/5">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            style={featheredMaskStyle}
            autoPlay
            muted
            playsInline
            preload="auto"
            loop={viewPerspective === 'airflow'}
            poster={currentPoster}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {!isPlaying && !isEnded && (
            <button
              type="button"
              onClick={startPlayback}
              className="absolute inset-0 flex flex-col items-center justify-center bg-ink/20 cursor-pointer z-20"
            >
              <div className="w-12 h-12 rounded-full bg-leaf text-white flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 ml-0.5 fill-white" />
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={togglePlay}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-ink/70 text-white flex items-center justify-center cursor-pointer z-20"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-white" />
            )}
          </button>
        </div>

        <div className="mt-3 text-center">
          <div className="font-heading font-bold text-xs text-ink">{currentStepTitle}</div>
          <p className="text-[11px] text-ink-60 mt-0.5">{currentStepDesc}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL MODE (HOMEPAGE SECTION - COMPACT & CENTERED)
  // ==========================================
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #EEE8DB 0%, #E4DCCB 100%)',
      }}
    >
      <div
        className="absolute top-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, ${topColor} 0%, rgba(238, 232, 219, 0) 100%)`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top, ${bottomColor} 0%, rgba(228, 220, 203, 0) 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 text-center">
        <SectionHeading
          title={t('works.title', 'HOW COLDEASY WORKS')}
          subtitle={t(
            'works.subtitle',
            'Passive evaporative cooling (SEEC) powered purely by thermodynamic airflow. Cooling without electricity.',
          )}
          isCentered
        />

        {/* Dual Mode Switcher Bar */}
        <div className="flex justify-center mt-6 mb-8">
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-ink/10 shadow-sm">
            <button
              type="button"
              onClick={() => handlePerspectiveChange('hardware')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewPerspective === 'hardware'
                  ? 'bg-leaf text-white shadow-xs'
                  : 'text-ink-60 hover:text-ink'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>1. 3D Hardware Assembly</span>
            </button>
            <button
              type="button"
              onClick={() => handlePerspectiveChange('airflow')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewPerspective === 'airflow'
                  ? 'bg-sky text-ink shadow-xs font-extrabold'
                  : 'text-ink-60 hover:text-ink'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>2. SEEC Airflow & Physics</span>
            </button>
          </div>
        </div>

        {/* Central Video Player Card (Single Viewport Focus, No Scrolling Required) */}
        <div className="bg-white rounded-[32px] p-5 sm:p-8 border border-ink/10 shadow-xl">
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-ink/5 shadow-inner">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover border-none shadow-none rounded-none outline-none block"
              style={featheredMaskStyle}
              autoPlay
              muted
              playsInline
              preload="auto"
              loop={viewPerspective === 'airflow'}
              poster={currentPoster}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && !isEnded && (
              <button
                type="button"
                onClick={startPlayback}
                className="absolute inset-0 flex flex-col items-center justify-center bg-ink/25 hover:bg-ink/35 active:bg-ink/45 transition-colors z-20 cursor-pointer group/play"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-leaf text-white flex items-center justify-center shadow-2xl group-hover/play:scale-110 active:scale-95 transition-transform">
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </div>
                <span className="mt-3 px-4 py-1.5 rounded-full bg-ink/80 backdrop-blur-xs text-white text-xs font-heading font-semibold uppercase tracking-wider shadow">
                  Watch{' '}
                  {viewPerspective === 'hardware' ? 'Hardware Assembly (56s)' : 'SEEC Airflow (8s)'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={togglePlay}
              className="absolute bottom-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#251A10]/70 hover:bg-[#251A10]/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md z-20"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
              )}
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-[4px] bg-ink/10 pointer-events-none z-10">
              <div
                className="h-full bg-sky transition-all duration-100 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Synchronized Step Banner directly below video */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-sand/60 border border-ink/10 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <span className="w-3 h-3 rounded-full bg-leaf shrink-0 mt-1.5 animate-pulse" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-ink-60 uppercase tracking-wider">
                    Step {currentStepNum} of {totalSteps}
                  </span>
                  <span className="text-[10px] font-heading font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-leaf-light text-leaf">
                    {viewPerspective === 'hardware'
                      ? `00:${Math.floor(currentTime).toString().padStart(2, '0')}s`
                      : 'Active Thermodynamics'}
                  </span>
                </div>
                <h4 className="font-heading font-black text-lg text-ink mt-1">
                  {currentStepTitle}
                </h4>
                <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed mt-0.5">
                  {currentStepDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Clickable Step Navigation Bar (No vertical scrolling needed) */}
          <div className="mt-4 flex items-center justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {viewPerspective === 'hardware'
              ? HOW_IT_WORKS_STEPS.map((s, idx) => {
                  const isActive = idx + 1 === currentStepNum;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => jumpToStep(s.start)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-leaf text-white shadow-xs scale-105'
                          : 'bg-sand/70 text-ink-70 hover:bg-sand hover:text-ink'
                      }`}
                    >
                      <span>{idx + 1}.</span>
                      <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
                    </button>
                  );
                })
              : AIRFLOW_STEPS.map((s, idx) => {
                  const isActive = idx + 1 === currentStepNum;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => jumpToStep(s.start)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-sky text-ink shadow-xs scale-105 font-extrabold'
                          : 'bg-sand/70 text-ink-70 hover:bg-sand hover:text-ink'
                      }`}
                    >
                      <span>{idx + 1}.</span>
                      <span>{s.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
          </div>

          {/* Verified Thermal Specification Footer */}
          <div className="mt-6 pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ink-60 font-body">Measured temperature drop:</span>
              <span className="font-heading font-bold text-leaf bg-leaf-light px-3 py-1 rounded-full">
                8°C – 12°C below ambient
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-70 font-heading font-semibold">
              <Sparkles className="w-4 h-4 text-marigold" />
              <span>Cooling without electricity</span>
            </div>
          </div>
        </div>

        {/* End Statement */}
        <div
          className={`transition-all duration-400 text-center ${
            isEnded
              ? 'opacity-100 translate-y-0 mt-8'
              : 'opacity-0 translate-y-3 pointer-events-none h-0 overflow-hidden mt-0'
          }`}
        >
          <p className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wide text-ink">
            Cooling without electricity.
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-ink/30 bg-white hover:bg-sand text-ink text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Animation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
