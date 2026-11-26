import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SectionHeading } from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { track } from '../lib/track';
import { VIDEO_SOURCES, HOW_IT_WORKS_STEPS, HARDWARE_VIDEO_DURATION } from '../data/mock';
import { Play, Pause, RotateCcw, Box, Wind, Sparkles } from 'lucide-react';

export interface HowItWorksSectionProps {
  mode?: 'full' | 'compact';
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
  // Loop on laptop and desktop. A continuous loop is hard on a low-end phone.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loopOnThisScreen, setLoopOnThisScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(HARDWARE_VIDEO_DURATION);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [clipVisible, setClipVisible] = useState(true);
  const switchingRef = useRef(false);

  // Ensure native DOM properties for reliable playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
  }, []);

  // The first clip is started by the in-view observer. Later toggles reuse the
  // same element, so the source has to be reloaded or the previous file stays.
  const didMountSource = useRef(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!didMountSource.current) {
      didMountSource.current = true;
      return;
    }

    let cancelled = false;
    let detach = () => {};
    switchingRef.current = true;
    if (!reducedMotion) setClipVisible(false);

    const swapAndPlay = () => {
      if (cancelled) return;
      video.muted = true;
      video.defaultMuted = true;
      if (viewPerspective === 'hardware') video.removeAttribute('src');
      else video.src = videoSrc;
      video.load();
      if (reducedMotion) {
        switchingRef.current = false;
        return;
      }
      let started = false;
      const play = () => {
        if (cancelled || started) return;
        started = true;
        video.removeEventListener('loadeddata', play);
        video
          .play()
          .then(() => {
            if (cancelled) return;
            setIsPlaying(true);
            setIsEnded(false);
            setClipVisible(true);
            window.setTimeout(() => {
              if (!cancelled) switchingRef.current = false;
            }, 80);
          })
          .catch(() => {
            if (cancelled) return;
            setIsPlaying(false);
            setClipVisible(true);
            switchingRef.current = false;
          });
      };
      video.addEventListener('loadeddata', play);
      detach = () => video.removeEventListener('loadeddata', play);
      if (video.readyState >= 2) play();
    };

    const fadeTimer = window.setTimeout(swapAndPlay, reducedMotion ? 0 : 160);
    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
      detach();
    };
  }, [viewPerspective, videoSrc, reducedMotion]);

  // Handle switching perspective tabs
  const handlePerspectiveChange = (perspective: ViewPerspective) => {
    if (perspective === viewPerspective) return;
    setIsUserPaused(false);
    setViewPerspective(perspective);
    setVideoSrc(resolveCurrentSource(perspective));
    setCurrentTime(0);
    setIsEnded(false);
    setDuration(perspective === 'hardware' ? HARDWARE_VIDEO_DURATION : 7.93);
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

  const stepPrefix = viewPerspective === 'hardware' ? 'works.hw' : 'works.air';
  const stepId =
    viewPerspective === 'hardware' ? currentHardwareStep.id : currentAirflowStep.id;
  const currentStepTitle = t(`${stepPrefix}.${stepId}.title`);
  const currentStepDesc = t(`${stepPrefix}.${stepId}.desc`);
  const currentStepNum =
    viewPerspective === 'hardware'
      ? currentHardwareStepIndex !== -1
        ? currentHardwareStepIndex + 1
        : 1
      : currentAirflowStepIndex !== -1
        ? currentAirflowStepIndex + 1
        : 1;

  const progressPct = Math.min(100, (currentTime / duration) * 100);

  // Start playback helper
  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    video.muted = true;
    video.defaultMuted = true;

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
  }, [hasStartedPlaying, reducedMotion, viewPerspective]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setLoopOnThisScreen(desktop.matches);
      setReducedMotion(reduced.matches);
    };
    apply();
    desktop.addEventListener('change', apply);
    reduced.addEventListener('change', apply);
    return () => {
      desktop.removeEventListener('change', apply);
      reduced.removeEventListener('change', apply);
    };
  }, []);

  const loopVideo = viewPerspective === 'airflow' || loopOnThisScreen;

  // Autoplay on mount / intersection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          if (!reducedMotion && !isEnded && !isUserPaused && !isPlaying) {
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
  }, [isEnded, isUserPaused, isPlaying, reducedMotion, startPlayback]);

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

  const currentPoster = VIDEO_SOURCES.poster;

  const videoSources =
    viewPerspective === 'hardware' ? (
      <>
        <source src={VIDEO_SOURCES.videoWebm} type="video/webm" media="(min-width: 768px)" />
        <source src={VIDEO_SOURCES.video1080} type="video/mp4" media="(min-width: 768px)" />
        <source src={VIDEO_SOURCES.video720} type="video/mp4" />
      </>
    ) : (
      <source src={videoSrc} type="video/mp4" />
    );
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
          {reducedMotion ? (
            <img
              src={currentPoster}
              alt=""
              className="h-full w-full object-cover"
              style={featheredMaskStyle}
            />
          ) : (
          <div
            className="h-full w-full transition-opacity duration-200 ease-out"
            style={{ opacity: clipVisible ? 1 : 0 }}
          >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={featheredMaskStyle}
            muted
            playsInline
            preload="none"
            loop={loopVideo}
            poster={currentPoster}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => {
              window.setTimeout(() => {
                if (switchingRef.current || !videoRef.current?.paused) return;
                setIsPlaying(false);
              }, 0);
            }}
          >
            {videoSources}
          </video>
          </div>
          )}

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
      className={`home-fade home-fade-hero relative w-full overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #dccfb8 0%, #E4DCCB 100%)',
      }}
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 text-center">
        <SectionHeading title={t('works.title')} isCentered />

        <div className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => handlePerspectiveChange('hardware')}
            className={`inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer ${
              viewPerspective === 'hardware'
                ? 'text-leaf underline decoration-2 underline-offset-[6px]'
                : 'text-ink-40 hover:text-ink'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{t('works.hardware')}</span>
          </button>
          <button
            type="button"
            onClick={() => handlePerspectiveChange('airflow')}
            className={`inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer ${
              viewPerspective === 'airflow'
                ? 'text-leaf underline decoration-2 underline-offset-[6px]'
                : 'text-ink-40 hover:text-ink'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{t('works.airflow')}</span>
          </button>
        </div>

        <div className="how-works-card rounded-[28px] px-4 py-5 sm:px-7 sm:py-6">
          <div className="how-works-stage relative w-full aspect-video overflow-hidden rounded-2xl">
            {reducedMotion ? (
              <img src={currentPoster} alt="" className="block h-full w-full object-cover" />
            ) : (
            <div
              className="h-full w-full transition-opacity duration-200 ease-out"
              style={{ opacity: clipVisible ? 1 : 0 }}
            >
            <video
              ref={videoRef}
              className="block h-full w-full object-cover"
              muted
              playsInline
              preload="none"
              loop={loopVideo}
              poster={currentPoster}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => {
                window.setTimeout(() => {
                  if (switchingRef.current || !videoRef.current?.paused) return;
                  setIsPlaying(false);
                }, 0);
              }}
            >
              {videoSources}
            </video>
            </div>
            )}

            {!isPlaying && !isEnded && (
              <button
                type="button"
                onClick={startPlayback}
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                aria-label={t('works.play')}
              >
                <span className="w-14 h-14 rounded-full bg-leaf/90 text-white flex items-center justify-center">
                  <Play className="w-6 h-6 ml-0.5 fill-white" />
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={togglePlay}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/40 text-leaf backdrop-blur-sm hover:bg-white/70 flex items-center justify-center cursor-pointer z-20"
              aria-label={isPlaying ? t('works.pause') : t('works.play')}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-leaf" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5 fill-leaf" />
              )}
            </button>

            <div className="absolute bottom-0 inset-x-0 h-[3px] bg-leaf/15 pointer-events-none z-10">
              <div
                className="h-full bg-leaf transition-all duration-100 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-5">
            <h4 className="font-heading font-bold text-lg text-ink">{currentStepTitle}</h4>
            <p className="mt-1 text-sm text-ink-60 font-body leading-relaxed">{currentStepDesc}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {(viewPerspective === 'hardware' ? HOW_IT_WORKS_STEPS : AIRFLOW_STEPS).map((s, idx) => {
              const isActive = idx + 1 === currentStepNum;
              const chipKey =
                viewPerspective === 'hardware' ? `works.hw.${s.id}.chip` : `works.air.${s.id}.chip`;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToStep(s.start)}
                  className={`px-1 py-1 text-xs font-heading font-semibold cursor-pointer ${
                    isActive
                      ? 'text-leaf underline decoration-2 underline-offset-[6px]'
                      : 'text-ink-40 hover:text-ink'
                  }`}
                >
                  {idx + 1}. {t(chipKey)}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-sm text-ink-60 font-body">
              {t('works.temp_value')}
            </p>
            <p className="inline-flex items-center gap-2 font-heading font-bold text-xl sm:text-2xl tracking-wide text-ink">
              <Sparkles className="w-5 h-5 text-leaf" />
              <span>{t('works.no_power_end')}</span>
            </p>
            {isEnded && (
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-leaf cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('works.replay')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
