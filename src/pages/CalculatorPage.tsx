import React from 'react';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { ChevronRight, ZapOff, Droplets, ShieldCheck, HelpCircle } from 'lucide-react';

interface CalculatorPageProps {
  onShowToast?: (message: string) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onShowToast }) => {
  return (
    <div className="w-full">
      {/* Breadcrumb Header Bar */}
      <div className="bg-cream border-b border-ink/10 py-3">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <nav
            className="flex items-center gap-2 text-xs font-heading font-medium text-ink-60"
            aria-label="Breadcrumb"
          >
            <a href="#/" className="hover:text-ink">
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-ink-40" />
            <span className="text-ink font-semibold">Savings Calculator</span>
          </nav>
        </div>
      </div>

      {/* Intro Header */}
      <div className="bg-cream py-8 md:py-12 border-b border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand border border-ink/10 text-xs font-heading font-bold uppercase tracking-wider text-leaf mb-3">
            <ZapOff className="w-3.5 h-3.5" />
            Zero Electricity Cooling Economics
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-tight">
            Produce Savings & Payback Calculator
          </h1>
          <p className="mt-2 text-ink-60 text-sm sm:text-base max-w-2xl font-body">
            Calculate how much daily harvest loss you can prevent by switching from dry room storage
            to natural SEEC evaporative cooling.
          </p>

          {/* Quick value props pill row */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-heading font-semibold text-ink">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-ink/10 shadow-2xs">
              <ZapOff className="w-4 h-4 text-leaf" />
              <span>₹0 Power Bills</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-ink/10 shadow-2xs">
              <Droplets className="w-4 h-4 text-sky" />
              <span>Tap Water Only</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-ink/10 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-leaf" />
              <span>Rapid Payback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator in Full Mode */}
      <SavingsCalculator mode="full" onShowToast={onShowToast} />

      {/* Informative Guidance Section */}
      <div className="bg-white py-14 sm:py-16 border-t border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-leaf">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl uppercase tracking-wider text-ink">
                Understanding Your ColdEasy Savings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-body text-ink-60">
              <div className="p-5 rounded-2xl bg-sand/60 border border-ink/5 space-y-2">
                <h3 className="font-heading font-bold text-ink uppercase text-xs">
                  Why electricity-free matters
                </h3>
                <p>
                  Cold rooms require commercial 3-phase power, diesel generator backups, and high
                  monthly electric tariffs. ColdEasy operates anywhere using passive evaporation and
                  ordinary room-temperature water.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand/60 border border-ink/5 space-y-2">
                <h3 className="font-heading font-bold text-ink uppercase text-xs">
                  Conservative estimation
                </h3>
                <p>
                  Our formula subtracts water and cooling pad maintenance expenses and calculates
                  realistic payback spans to give you practical planning figures rather than
                  inflated promises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
