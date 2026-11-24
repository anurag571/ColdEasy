import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { BrandPattern } from '../components/BrandPattern';

interface ComingSoonPageProps {
  pageName: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ pageName }) => {
  return (
    <div className="relative w-full min-h-[70vh] bg-sand py-20 px-4 sm:px-6 flex items-center justify-center overflow-hidden">
      {/* Brand Pattern at low contrast in the Coming soon page */}
      <div className="absolute top-0 right-0 text-olive/8 pointer-events-none">
        <BrandPattern variant="subtle" />
      </div>
      <div className="absolute bottom-0 left-0 text-olive/8 pointer-events-none rotate-180">
        <BrandPattern variant="subtle" />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-cream rounded-[24px] p-8 sm:p-10 border border-ink/10 shadow-lg text-center">
        {/* Signature Brand Accent Bar (horizontal or stacked pill) */}
        <div className="inline-flex w-16 h-1.5 rounded-full overflow-hidden mx-auto mb-6">
          <span className="w-1/4 h-full bg-sky" />
          <span className="w-1/4 h-full bg-marigold" />
          <span className="w-1/4 h-full bg-chilli" />
          <span className="w-1/4 h-full bg-leaf" />
        </div>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-ink mb-2">
          {pageName}
        </h1>

        <p className="text-sm font-semibold uppercase tracking-wider text-leaf mb-4">Coming Soon</p>

        <p className="text-xs sm:text-sm text-ink-60 font-body leading-relaxed max-w-md mx-auto mb-8">
          We are currently preparing full field trials, thermodynamic data sheets, and partner
          resources for this section. In the meantime, explore the ColdEasy Box or chat with our
          field team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/"
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-leaf text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>

          <a
            href="https://wa.me/919182968542"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-6 rounded-full border border-ink-40 text-ink font-heading font-medium text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-leaf" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
};
