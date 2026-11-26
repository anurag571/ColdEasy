import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TestimonialVideo } from '../../data/mock';
import { useLanguage } from '../../context/LanguageContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2';

export const VideoLightbox: React.FC<{
  video: TestimonialVideo;
  onClose: () => void;
}> = ({ video, onClose }) => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
      if (dialog.open) dialog.close();
    };
  }, []);

  const youtubeId = video.youtubeId;
  if (!youtubeId) return null;

  return (
    <dialog
      ref={dialogRef}
      className="testimonial-lightbox m-auto bg-transparent p-0"
      aria-label={`${video.personName} video`}
    >
      <div className="relative aspect-[9/16] h-[85vh] max-h-[85vh]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={`${video.personName} video`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full rounded-[22px] bg-studio"
        />
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className={`absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-cream text-ink ${focusRing}`}
          aria-label={t('testimonials.close_video')}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </dialog>
  );
};
