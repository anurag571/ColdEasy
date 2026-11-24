import React from 'react';
import { Package, Wind, Droplets, Camera, Store, Apple } from 'lucide-react';

interface ImagePlaceholderProps {
  label: string;
  sublabel?: string;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-square', 'aspect-[4/3]', 'aspect-[9/16]'
  iconType?: 'box' | 'pad' | 'stall' | 'produce' | 'video' | 'media';
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  label,
  sublabel,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  iconType = 'box',
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'pad':
        return <Wind className="w-8 h-8 text-sky" />;
      case 'stall':
        return <Store className="w-8 h-8 text-leaf" />;
      case 'produce':
        return <Apple className="w-8 h-8 text-marigold" />;
      case 'video':
        return <Camera className="w-8 h-8 text-sky" />;
      case 'media':
        return <Droplets className="w-8 h-8 text-olive" />;
      default:
        return <Package className="w-8 h-8 text-leaf" />;
    }
  };

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative rounded-[22px] bg-sand border border-ink/5 overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all select-none ${aspectRatio} ${className}`}
    >
      {/* Soft crate texture / subtle visual structure */}
      <div className="absolute inset-4 rounded-[16px] border border-dashed border-ink/10 pointer-events-none flex items-center justify-center" />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-[85%]">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-3">
          {getIcon()}
        </div>

        <span className="font-heading font-semibold text-xs md:text-sm text-ink tracking-wide uppercase line-clamp-2">
          {label}
        </span>

        {sublabel && (
          <span className="mt-1 text-[11px] md:text-xs text-ink-60 line-clamp-2">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
