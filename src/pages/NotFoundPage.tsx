import React from 'react';
import { BrandPattern } from '../components/BrandPattern';
import { waLink, handleWaClick } from '../lib/wa';
import { Home, ShoppingBag, MessageCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative w-full min-h-[70vh] bg-sand py-20 px-4 sm:px-6 flex items-center justify-center overflow-hidden">
      {/* Soft brand patterns in background */}
      <div className="absolute top-0 right-0 text-olive/8 pointer-events-none">
        <BrandPattern variant="subtle" />
      </div>
      <div className="absolute bottom-0 left-0 text-olive/8 pointer-events-none rotate-180">
        <BrandPattern variant="subtle" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-cream rounded-[28px] p-8 sm:p-10 border border-ink/10 shadow-lg text-center">
        {/* Accent Bar Stack */}
        <div className="inline-flex w-16 h-1.5 rounded-full overflow-hidden mx-auto mb-6">
          <span className="w-1/4 h-full bg-sky" />
          <span className="w-1/4 h-full bg-marigold" />
          <span className="w-1/4 h-full bg-chilli" />
          <span className="w-1/4 h-full bg-leaf" />
        </div>

        <span className="font-heading font-extrabold text-4xl sm:text-5xl text-ink tracking-tight block mb-2">
          404
        </span>

        <h1 className="font-heading font-bold text-lg sm:text-xl uppercase tracking-wider text-ink mb-3">
          This page wandered off
        </h1>

        <p className="text-xs sm:text-sm text-ink-60 font-body leading-relaxed mb-8">
          The link you followed doesn&apos;t exist or may have been moved. Return home, browse our
          cooling crates, or message us on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/"
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-leaf text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Home className="w-4 h-4" />
            Home
          </a>

          <a
            href="#/products"
            className="w-full sm:w-auto py-3 px-6 rounded-full border-2 border-ink text-ink font-heading font-semibold text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Products
          </a>

          <a
            href={waLink({ type: 'home' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWaClick({ type: 'home' })}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-sand border border-ink/10 text-ink font-heading font-semibold text-xs uppercase tracking-wider hover:bg-sand/80 transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-leaf" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
