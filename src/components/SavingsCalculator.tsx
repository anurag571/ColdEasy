import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/mock';
import { useLanguage } from '../context/LanguageContext';

export interface CalculatorCropAssumption {
  id: string;
  name: string;
  defaultPricePerKg: number;
  spoilageReduction: {
    low: number;
    high: number;
  };
}

export interface CalculatorProductAssumption {
  productId: string;
  name: string;
  capacityKg: number;
  runningCostPerMonth: number;
}

export const CALCULATOR_CROPS: CalculatorCropAssumption[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    defaultPricePerKg: 35,
    spoilageReduction: { low: 0.35, high: 0.55 },
  },
  {
    id: 'banana',
    name: 'Banana',
    defaultPricePerKg: 30,
    spoilageReduction: { low: 0.3, high: 0.5 },
  },
  { id: 'mango', name: 'Mango', defaultPricePerKg: 80, spoilageReduction: { low: 0.3, high: 0.5 } },
  {
    id: 'leafy-greens',
    name: 'Leafy greens',
    defaultPricePerKg: 40,
    spoilageReduction: { low: 0.4, high: 0.65 },
  },
  {
    id: 'onion',
    name: 'Onion',
    defaultPricePerKg: 28,
    spoilageReduction: { low: 0.25, high: 0.45 },
  },
  {
    id: 'flowers',
    name: 'Flowers',
    defaultPricePerKg: 120,
    spoilageReduction: { low: 0.45, high: 0.7 },
  },
  { id: 'other', name: 'Other', defaultPricePerKg: 45, spoilageReduction: { low: 0.3, high: 0.5 } },
];

export const CALCULATOR_PRODUCTS: CalculatorProductAssumption[] = [
  { productId: 'coldeasy-box', name: 'ColdEasy Box', capacityKg: 25, runningCostPerMonth: 50 },
  {
    productId: 'coldeasy-autobox-3',
    name: 'AutoBox – 3 Box',
    capacityKg: 75,
    runningCostPerMonth: 120,
  },
];
import { SectionHeading } from './SectionHeading';
import { useCart } from '../context/CartContext';
import { waLink } from '../lib/wa';
import { track } from '../lib/track';
import {
  Minus,
  Plus,
  Share2,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  Building2,
  CheckCircle2,
  Scale,
  Calendar,
  Sparkles,
  RotateCcw,
  ZapOff,
} from 'lucide-react';

export type UserPersona = 'Farmer' | 'Vendor or retailer' | 'FPO' | 'Other';
export type Timeframe = 'monthly' | 'seasonal' | 'annual';

export interface SavingsCalculatorProps {
  mode?: 'full' | 'compact';
  preselectedProduct?: string;
  className?: string;
  onShowToast?: (message: string) => void;
}

const PERSONAS: { id: UserPersona; label: string; sub: string; icon: string }[] = [
  { id: 'Farmer', label: 'calc.who.farmer', sub: 'calc.who.farmer_sub', icon: '🚜' },
  { id: 'Vendor or retailer', label: 'calc.who.vendor', sub: 'calc.who.vendor_sub', icon: '🛒' },
  { id: 'FPO', label: 'calc.who.fpo', sub: 'calc.who.fpo_sub', icon: '🏢' },
  { id: 'Other', label: 'calc.who.other', sub: 'calc.who.other_sub', icon: '📦' },
];

const CROP_ICONS: Record<string, string> = {
  tomato: '🍅',
  banana: '🍌',
  mango: '🥭',
  'leafy-greens': '🥬',
  onion: '🧅',
  flowers: '🌸',
  other: '🧺',
};

interface PresetScenario {
  id: string;
  label: string;
  icon: string;
  persona: UserPersona;
  cropId: string;
  kg: number;
  price: number;
  spoilage: number;
  days: number;
  productId: string;
  units: number;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'tomato-smallholder',
    label: 'Tomato Grower (40 kg/day)',
    icon: '🍅',
    persona: 'Farmer',
    cropId: 'tomato',
    kg: 40,
    price: 35,
    spoilage: 20,
    days: 26,
    productId: 'coldeasy-box',
    units: 2,
  },
  {
    id: 'greens-vendor',
    label: 'Leafy Greens Cart (25 kg/day)',
    icon: '🥬',
    persona: 'Vendor or retailer',
    cropId: 'leafy-greens',
    kg: 25,
    price: 40,
    spoilage: 25,
    days: 28,
    productId: 'coldeasy-box',
    units: 1,
  },
  {
    id: 'mango-orchard',
    label: 'Mango Orchard (80 kg/day)',
    icon: '🥭',
    persona: 'Farmer',
    cropId: 'mango',
    kg: 80,
    price: 80,
    spoilage: 18,
    days: 24,
    productId: 'coldeasy-autobox-3',
    units: 2,
  },
  {
    id: 'fpo-hub',
    label: 'FPO Mandi Hub (200 kg/day)',
    icon: '🏢',
    persona: 'FPO',
    cropId: 'tomato',
    kg: 200,
    price: 32,
    spoilage: 22,
    days: 28,
    productId: 'coldeasy-autobox-3',
    units: 3,
  },
];

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  mode = 'full',
  preselectedProduct,
  className = '',
  onShowToast,
}) => {
  const { t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const [hasTrackedFirstChange, setHasTrackedFirstChange] = useState(() => {
    try {
      return sessionStorage.getItem('ce_calc_tracked') === 'true';
    } catch {
      return false;
    }
  });

  // Parse initial state from URL if present (useful for shared links)
  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    const rawHash = window.location.hash || '';
    const [, queryPart] = rawHash.split('?');
    return new URLSearchParams(queryPart || window.location.search || '');
  }, []);

  const [persona, setPersona] = useState<UserPersona>(() => {
    const p = initialParams.get('persona');
    if (p && PERSONAS.some((item) => item.id === p)) return p as UserPersona;
    return 'Farmer';
  });

  const [selectedCropId, setSelectedCropId] = useState<string>(() => {
    const c = initialParams.get('crop');
    if (
      c &&
      CALCULATOR_CROPS.some((item) => item.id === c || item.name.toLowerCase() === c.toLowerCase())
    ) {
      const match = CALCULATOR_CROPS.find(
        (item) => item.id === c || item.name.toLowerCase() === c.toLowerCase(),
      );
      return match ? match.id : 'tomato';
    }
    return 'tomato';
  });

  const activeCrop: CalculatorCropAssumption = useMemo(() => {
    return CALCULATOR_CROPS.find((c) => c.id === selectedCropId) || CALCULATOR_CROPS[0];
  }, [selectedCropId]);

  const [kgPerDay, setKgPerDay] = useState<number>(() => {
    const kg = Number(initialParams.get('kg'));
    return !isNaN(kg) && kg >= 5 && kg <= 500 ? kg : 40;
  });

  const [pricePerKg, setPricePerKg] = useState<number>(() => {
    const price = Number(initialParams.get('price'));
    return !isNaN(price) && price >= 5 ? price : activeCrop.defaultPricePerKg;
  });

  const [spoilagePct, setSpoilagePct] = useState<number>(() => {
    const s = Number(initialParams.get('spoilage'));
    return !isNaN(s) && s >= 0 && s <= 50 ? s : 20;
  });

  const [daysPerMonth, setDaysPerMonth] = useState<number>(() => {
    const d = Number(initialParams.get('days'));
    return !isNaN(d) && d >= 1 && d <= 31 ? d : 26;
  });

  // Timeframe selector for displaying savings
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  // Product selection: default to preselectedProduct or ColdEasy Box
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (preselectedProduct) {
      const match = CALCULATOR_PRODUCTS.find(
        (p) => p.productId === preselectedProduct || p.productId.includes(preselectedProduct),
      );
      if (match) return match.productId;
    }
    const paramProd = initialParams.get('product');
    if (paramProd) {
      const match = CALCULATOR_PRODUCTS.find(
        (p) => p.productId === paramProd || p.productId.includes(paramProd),
      );
      if (match) return match.productId;
    }
    return 'coldeasy-box';
  });

  const [units, setUnits] = useState<number>(() => {
    const u = Number(initialParams.get('units'));
    return !isNaN(u) && u >= 1 ? u : 1;
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active product details from mock data
  const activeProductAssumption = useMemo(() => {
    return (
      CALCULATOR_PRODUCTS.find((p) => p.productId === selectedProductId) || CALCULATOR_PRODUCTS[0]
    );
  }, [selectedProductId]);

  const activeCatalogProduct = useMemo(() => {
    return (
      PRODUCTS.find((p) => p.id === selectedProductId) ||
      PRODUCTS.find((p) => p.id === 'coldeasy-box') ||
      PRODUCTS[0]
    );
  }, [selectedProductId]);

  const capacityPerUnit = activeProductAssumption.capacityKg;
  const recommendedUnits = Math.max(1, Math.ceil(kgPerDay / capacityPerUnit));

  // If user switches product or kg increases, suggest minimum required units if user was at 1
  useEffect(() => {
    if (kgPerDay > capacityPerUnit && units === 1) {
      setUnits(recommendedUnits);
    }
  }, [kgPerDay, capacityPerUnit, recommendedUnits, units]);

  // Session-first tracking trigger
  const triggerFirstChangeTracking = () => {
    if (!hasTrackedFirstChange) {
      try {
        sessionStorage.setItem('ce_calc_tracked', 'true');
      } catch {
        // ignore
      }
      setHasTrackedFirstChange(true);
      track('calculator_used', {
        crop: activeCrop.name,
        kg: kgPerDay,
        product: activeProductAssumption.name,
        savedLow: calculations.savedLow,
        savedHigh: calculations.savedHigh,
      });
    }
  };

  // When crop changes, update default price if it hasn't been heavily customized
  const handleCropChange = (cropId: string) => {
    setActivePresetId(null);
    setSelectedCropId(cropId);
    const newCrop = CALCULATOR_CROPS.find((c) => c.id === cropId);
    if (newCrop) {
      setPricePerKg(newCrop.defaultPricePerKg);
    }
    triggerFirstChangeTracking();
  };

  // Apply quick preset scenario
  const handleApplyPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setPersona(preset.persona);
    setSelectedCropId(preset.cropId);
    setKgPerDay(preset.kg);
    setPricePerKg(preset.price);
    setSpoilagePct(preset.spoilage);
    setDaysPerMonth(preset.days);
    setSelectedProductId(preset.productId);
    setUnits(preset.units);
    triggerFirstChangeTracking();
    if (onShowToast) {
      onShowToast(`Loaded preset: ${preset.label}`);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    setActivePresetId(null);
    setPersona('Farmer');
    setSelectedCropId('tomato');
    setKgPerDay(40);
    setPricePerKg(35);
    setSpoilagePct(20);
    setDaysPerMonth(26);
    setSelectedProductId('coldeasy-box');
    setUnits(2);
    setTimeframe('monthly');
  };

  // ==========================================
  // CONSERVATIVE MATH CALCULATIONS
  // ==========================================
  const calculations = useMemo(() => {
    const totalCapacity = capacityPerUnit * units;
    const kgCovered = Math.min(kgPerDay, totalCapacity);
    const spoilageFraction = spoilagePct / 100;

    // Loss today per month = kg per day × spoilage % × price × days
    const lossTodayRaw = kgPerDay * spoilageFraction * pricePerKg * daysPerMonth;
    const lossToday = Math.round(lossTodayRaw / 10) * 10;
    const monthlyLossKg = Math.round(kgPerDay * spoilageFraction * daysPerMonth);

    // Running cost per month (water + pad care) for all units
    const totalRunningCost = activeProductAssumption.runningCostPerMonth * units;

    // Monthly savedLow & savedHigh
    const savedLowRaw =
      kgCovered * spoilageFraction * activeCrop.spoilageReduction.low * pricePerKg * daysPerMonth -
      totalRunningCost;

    const savedHighRaw =
      kgCovered * spoilageFraction * activeCrop.spoilageReduction.high * pricePerKg * daysPerMonth -
      totalRunningCost;

    const savedLowMonthly = Math.max(0, Math.round(savedLowRaw / 10) * 10);
    const savedHighMonthly = Math.max(0, Math.round(savedHighRaw / 10) * 10);

    // {t('calc.saved')} in kg/month
    const produceSavedLowMonthly = Math.round(
      kgCovered * spoilageFraction * activeCrop.spoilageReduction.low * daysPerMonth,
    );
    const produceSavedHighMonthly = Math.round(
      kgCovered * spoilageFraction * activeCrop.spoilageReduction.high * daysPerMonth,
    );

    // Multipliers for timeframe view
    const timeframeMultiplier = timeframe === 'annual' ? 12 : timeframe === 'seasonal' ? 4 : 1;

    const savedLow = savedLowMonthly * timeframeMultiplier;
    const savedHigh = savedHighMonthly * timeframeMultiplier;
    const produceSavedLow = produceSavedLowMonthly * timeframeMultiplier;
    const produceSavedHigh = produceSavedHighMonthly * timeframeMultiplier;
    const lossDisplay = lossToday * timeframeMultiplier;

    // Payback period (hardware is a one-time investment, compared against monthly savings)
    const unitPrice = activeCatalogProduct.price ?? 3990;
    const totalInvestment = unitPrice * units;

    const dailySavedLow = savedLowMonthly / daysPerMonth;
    const dailySavedHigh = savedHighMonthly / daysPerMonth;

    let paybackText: string;
    let isPaybackOverYear = false;
    let daysFast = 0;
    let daysSlow = 0;

    if (dailySavedLow <= 0 || dailySavedHigh <= 0) {
      paybackText = 'More than a year at this volume';
      isPaybackOverYear = true;
    } else {
      daysFast = Math.round(totalInvestment / dailySavedHigh);
      daysSlow = Math.round(totalInvestment / dailySavedLow);

      if (daysSlow > 365) {
        paybackText = 'More than a year at this volume';
        isPaybackOverYear = true;
      } else {
        paybackText = `${daysFast}–${daysSlow} days`;
      }
    }

    // Comparison bar percentage calculation
    const avgSaved = (savedLowMonthly + savedHighMonthly) / 2;
    const remainingLoss = Math.max(0, lossToday - avgSaved);
    const remainingPct =
      lossToday > 0 ? Math.min(100, Math.round((remainingLoss / lossToday) * 100)) : 0;
    const savedPct = Math.max(0, 100 - remainingPct);

    // Reduction percentages for display
    const lowReductionPct = Math.round(activeCrop.spoilageReduction.low * 100);
    const highReductionPct = Math.round(activeCrop.spoilageReduction.high * 100);

    return {
      kgCovered,
      totalCapacity,
      lossToday,
      lossDisplay,
      monthlyLossKg,
      savedLowMonthly,
      savedHighMonthly,
      savedLow,
      savedHigh,
      produceSavedLow,
      produceSavedHigh,
      paybackText,
      daysFast,
      daysSlow,
      isPaybackOverYear,
      totalInvestment,
      totalRunningCost,
      unitPrice,
      remainingLoss: Math.round(remainingLoss / 10) * 10,
      remainingPct,
      savedPct,
      lowReductionPct,
      highReductionPct,
      timeframeMultiplier,
    };
  }, [
    kgPerDay,
    spoilagePct,
    pricePerKg,
    daysPerMonth,
    units,
    capacityPerUnit,
    activeCrop,
    activeProductAssumption,
    activeCatalogProduct,
    timeframe,
  ]);

  // Persona text customization
  const personaIntro = useMemo(() => {
    switch (persona) {
      case 'Farmer':
        return `As a grower handling ${kgPerDay} kg of ${activeCrop.name.toLowerCase()} daily, heat & delays take a heavy toll.`;
      case 'Vendor or retailer':
        return `As a retailer selling ${kgPerDay} kg of fresh ${activeCrop.name.toLowerCase()} daily, unsold produce hurts margins.`;
      case 'FPO':
        return `For your cluster handling ${kgPerDay} kg of ${activeCrop.name.toLowerCase()} daily across collection routes.`;
      case 'Other':
      default:
        return `Handling ${kgPerDay} kg of ${activeCrop.name.toLowerCase()} per day without active cold chain.`;
    }
  }, [persona, kgPerDay, activeCrop.name]);

  // CTAs
  const handleBuy = () => {
    track('calculator_cta', {
      type: 'buy',
      product: selectedProductId,
      units,
      crop: activeCrop.name,
      kg: kgPerDay,
    });
    addToCart(selectedProductId, units);
    setIsCartOpen(true);
    if (onShowToast) {
      onShowToast(`Added ${units} × ${activeProductAssumption.name} to cart`);
    }
  };

  const handleWhatsApp = () => {
    track('calculator_cta', {
      type: 'whatsapp',
      product: activeProductAssumption.name,
      crop: activeCrop.name,
      kg: kgPerDay,
    });
    const message = `Hi ColdEasy! I checked the savings calculator for my harvest:\n• Crop: ${activeCrop.name}\n• Daily Volume: ${t('calc.per_day', { kg: kgPerDay })}\n• Selling Price: ₹${pricePerKg}/kg\n• Estimated Spoilage Today: ${spoilagePct}%\n• Hardware: ${units} × ${activeProductAssumption.name}\n• Estimated Net Savings: ₹${calculations.savedLowMonthly.toLocaleString('en-IN')}–₹${calculations.savedHighMonthly.toLocaleString('en-IN')}/month\n• Payback: ${calculations.paybackText}\n\nCould you please help me with availability and doorstep delivery?`;
    const url = waLink({ type: 'calculator', message });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBulkQuote = () => {
    track('calculator_cta', {
      type: 'bulk',
      product: selectedProductId,
      crop: activeCrop.name,
      kg: kgPerDay,
    });
    const params = new URLSearchParams({
      product: selectedProductId,
      crop: activeCrop.name,
      quantity: `${t('calc.per_day', { kg: kgPerDay })} (${units} units)`,
    });
    window.location.hash = `#/enquiry/bulk?${params.toString()}`;
  };

  const handleShare = async () => {
    track('calculator_cta', { type: 'share' });
    const params = new URLSearchParams({
      persona,
      crop: activeCrop.id,
      kg: kgPerDay.toString(),
      price: pricePerKg.toString(),
      spoilage: spoilagePct.toString(),
      days: daysPerMonth.toString(),
      product: selectedProductId,
      units: units.toString(),
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}#/calculator?${params.toString()}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
        if (onShowToast) {
          onShowToast('Estimate link copied to clipboard!');
        }
      } else {
        window.prompt('Copy your ColdEasy savings estimate link:', shareUrl);
      }
    } catch {
      window.prompt('Copy your ColdEasy savings estimate link:', shareUrl);
    }
  };

  const isBulkRecommended = persona === 'FPO' || kgPerDay > 150;

  // Calculation for progress slider fill
  const kgSliderPct = ((kgPerDay - 5) / (500 - 5)) * 100;
  const spoilageSliderPct = (spoilagePct / 50) * 100;

  // ==========================================
  // COMPACT MODE (FOR PRODUCT PAGES)
  // ==========================================
  if (mode === 'compact') {
    return (
      <div
        className={`bg-sand/80 rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-ink/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-leaf" />
              <h3 className="font-heading font-bold text-sm sm:text-base uppercase tracking-wider text-ink">
                {t('calc.save_q')}
              </h3>
            </div>
            <p className="text-[11px] text-ink-60 mt-0.5">
              {t('calc.live', { name: activeProductAssumption.name })}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-leaf bg-white px-2.5 py-1 rounded-full border border-leaf/20 shadow-2xs">
            <Sparkles className="w-3 h-3 text-leaf" />
            {t('calc.interactive')}
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Crop Chips */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-heading font-semibold uppercase tracking-wider text-ink">
                {t('calc.store')}
              </span>
              <span className="text-[11px] text-ink-60">
                {activeCrop.name} (₹{pricePerKg}/kg)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CALCULATOR_CROPS.map((c) => {
                const isSelected = selectedCropId === c.id;
                const emoji = CROP_ICONS[c.id] || '🧺';
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCropChange(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-leaf text-white font-semibold shadow-xs ring-2 ring-leaf/20'
                        : 'bg-white text-ink border border-ink/10 hover:border-ink/30 hover:bg-sand'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{t(`calc.crop.${c.id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Volume */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-heading font-semibold uppercase tracking-wider text-ink">
                {t('calc.volume')}
              </span>
              <span className="font-heading font-bold text-ink bg-white px-3 py-0.5 rounded-full border border-ink/10 shadow-2xs text-xs">
                {t('calc.per_day', { kg: kgPerDay })}
              </span>
            </div>
            <div className="relative py-1">
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={kgPerDay}
                onChange={(e) => {
                  setKgPerDay(Number(e.target.value));
                  triggerFirstChangeTracking();
                }}
                style={{
                  background: `linear-gradient(to right, #487537 0%, #487537 ${kgSliderPct}%, #E5E7EB ${kgSliderPct}%, #E5E7EB 100%)`,
                }}
                className="w-full accent-leaf cursor-pointer h-2.5 rounded-lg appearance-none bg-ink/10"
                aria-label="Daily produce volume slider"
              />
            </div>
          </div>

          {/* Price & Spoilage in 2 columns */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white rounded-2xl p-3 border border-ink/10">
              <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-ink-60 mb-1">
                Selling price
              </label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setPricePerKg((p) => Math.max(5, p - 5));
                    triggerFirstChangeTracking();
                  }}
                  className="w-7 h-7 rounded-full bg-sand text-ink flex items-center justify-center hover:bg-ink/10 cursor-pointer active:scale-95 transition-all"
                  aria-label="Decrease price"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-heading font-extrabold text-sm text-ink">
                  ₹{pricePerKg}
                  <span className="text-[10px] font-normal text-ink-60">/kg</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPricePerKg((p) => p + 5);
                    triggerFirstChangeTracking();
                  }}
                  className="w-7 h-7 rounded-full bg-sand text-ink flex items-center justify-center hover:bg-ink/10 cursor-pointer active:scale-95 transition-all"
                  aria-label="Increase price"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-ink/10">
              <div className="flex items-center justify-between text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
                <span className="text-ink-60">{t('calc.spoilage')}</span>
                <span className="text-chilli font-extrabold">{spoilagePct}%</span>
              </div>
              <div className="pt-2">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={2}
                  value={spoilagePct}
                  onChange={(e) => {
                    setSpoilagePct(Number(e.target.value));
                    triggerFirstChangeTracking();
                  }}
                  style={{
                    background: `linear-gradient(to right, #EC2727 0%, #EC2727 ${spoilageSliderPct}%, #E5E7EB ${spoilageSliderPct}%, #E5E7EB 100%)`,
                  }}
                  className="w-full accent-chilli cursor-pointer h-2 rounded-lg appearance-none bg-ink/10"
                  aria-label="Spoilage percentage slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Result Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-ink/10 shadow-xs">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-60">
              Estimated Monthly Savings
            </span>
            <span className="text-[10px] font-medium text-leaf bg-leaf-light px-2 py-0.5 rounded-full">
              Zero electricity
            </span>
          </div>

          <div className="text-2xl font-heading font-black text-leaf mt-1 tracking-tight">
            ₹{calculations.savedLowMonthly.toLocaleString('en-IN')} – ₹
            {calculations.savedHighMonthly.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-ink-60 ml-1">/ month</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-ink/5">
            <div className="bg-sand/60 p-2.5 rounded-xl">
              <span className="text-ink-60 block text-[10px] font-heading font-semibold uppercase">
                {t('calc.saved')}
              </span>
              <span className="font-heading font-bold text-ink mt-0.5 block">
                {calculations.produceSavedLow}–{calculations.produceSavedHigh} kg/mo
              </span>
            </div>
            <div className="bg-sand/60 p-2.5 rounded-xl">
              <span className="text-ink-60 block text-[10px] font-heading font-semibold uppercase">
                {t('calc.pays')}
              </span>
              <span
                className="font-heading font-bold text-ink mt-0.5 block truncate"
                title={calculations.paybackText}
              >
                {calculations.isPaybackOverYear ? '> 1 year' : `In ${calculations.paybackText}`}
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-ink/10">
            <a
              href={`#/calculator?crop=${encodeURIComponent(activeCrop.id)}&kg=${kgPerDay}&price=${pricePerKg}&spoilage=${spoilagePct}&product=${selectedProductId}`}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-leaf hover:underline cursor-pointer group"
            >
              <span>{t('calc.breakdown')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <span className="text-[10px] text-ink-40 italic">{t('calc.conservative')}</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL MODE (HOMEPAGE & #/calculator ROUTE)
  // ==========================================
  return (
    <section
      id="calculator"
      className={`w-full bg-sand py-14 sm:py-16 md:py-20 border-b border-ink/5 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading with Share & Reset actions */}
        <SectionHeading
          title="HOW MUCH COULD YOU SAVE?"
          subtitle={t('calc.engine')}
          rightAction={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ink/15 bg-white hover:bg-sand text-ink text-xs font-heading font-semibold transition-all cursor-pointer shadow-2xs hover:border-ink/30"
                title="Reset to default settings"
              >
                <RotateCcw className="w-3.5 h-3.5 text-ink-60" />
                <span className="hidden sm:inline">{t('calc.reset')}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 bg-white hover:bg-sand text-ink text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:border-ink/40 active:scale-95"
                title="Share this calculation"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-leaf stroke-[3]" />
                    <span className="text-leaf font-bold">{t('calc.copied')}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-ink-60" />
                    <span>{t('calc.share')}</span>
                  </>
                )}
              </button>
            </div>
          }
        />

        {/* 1-Tap Quick Scenarios Bar */}
        <div className="mb-8 p-4 rounded-[22px] bg-white border border-ink/10 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-marigold" />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink">
                {t('calc.scenarios')}
              </span>
            </div>
            <span className="text-[11px] text-ink-60">
              {t('calc.scenarios_sub')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_SCENARIOS.map((sc) => {
              const isActive = activePresetId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleApplyPreset(sc)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-leaf-light/60 border-leaf text-ink shadow-2xs ring-1 ring-leaf'
                      : 'bg-sand/60 border-ink/10 text-ink hover:bg-sand hover:border-ink/30'
                  }`}
                >
                  <span className="text-xl shrink-0">{sc.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-heading font-bold text-ink truncate">{sc.label}</p>
                    <p className="text-[10px] text-ink-60 truncate">
                      {sc.kg} kg/day · {sc.persona}
                    </p>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-leaf shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Inputs Left (7 cols), Output Right (5 cols, sticky) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================== */}
          {/* LEFT COLUMN: Interactive Parameter Inputs */}
          {/* ========================================== */}
          <div className="lg:col-span-7 space-y-5">
            {/* Input 1: Persona */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  I am operating as a:
                </label>
                <span className="text-[11px] text-ink-60">{t('calc.personal')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PERSONAS.map((p) => {
                  const isSelected = persona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setPersona(p.id);
                        triggerFirstChangeTracking();
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-ink text-cream border-ink shadow-xs ring-2 ring-ink/20'
                          : 'bg-sand/60 text-ink border-ink/10 hover:border-ink/30 hover:bg-sand'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{p.icon}</span>
                      <div className="min-w-0">
                        <p
                          className={`font-heading font-bold text-xs sm:text-sm ${isSelected ? 'text-cream font-extrabold' : 'text-ink'}`}
                        >
                          {t(p.label)}
                        </p>
                        <p
                          className={`text-[10px] truncate ${isSelected ? 'text-cream/80 font-medium' : 'text-ink-60'}`}
                        >
                          {t(p.sub)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Crop selection */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  What do you harvest or sell?
                </label>
                <span className="text-[11px] font-heading font-semibold text-leaf">
                  Est. {calculations.lowReductionPct}–{calculations.highReductionPct}% loss cut
                </span>
              </div>
              <p className="text-[11px] text-ink-60 mb-3">
                Each crop has unique respiration and evaporative cooling response curves.
              </p>

              <div className="flex flex-wrap gap-2">
                {CALCULATOR_CROPS.map((c) => {
                  const isSelected = selectedCropId === c.id;
                  const emoji = CROP_ICONS[c.id] || '🧺';
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCropChange(c.id)}
                      className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-leaf text-white shadow-xs ring-2 ring-leaf/30 scale-[1.02]'
                          : 'bg-sand/70 text-ink border border-ink/10 hover:bg-leaf-light/40 hover:border-leaf/30'
                      }`}
                    >
                      <span className="text-base">{emoji}</span>
                      <span>{t(`calc.crop.${c.id}`)}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] ml-0.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 3: {t('calc.volume')} (Stepper + Progress Fill Slider + Quick volume chips) */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    How much produce per day?
                  </label>
                  <span className="text-[11px] text-ink-60">
                    Typical daily batch handled in harvest season
                  </span>
                </div>

                <div className="flex items-center bg-sand rounded-full p-1 border border-ink/10 self-start sm:self-auto shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      setKgPerDay((k) => Math.max(5, k - 5));
                      triggerFirstChangeTracking();
                    }}
                    disabled={kgPerDay <= 5}
                    className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 disabled:opacity-30 cursor-pointer shadow-2xs"
                    aria-label="Decrease kg per day"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-24 text-center font-heading font-black text-base text-ink select-none">
                    {kgPerDay} <span className="text-xs font-semibold text-ink-60">kg</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      setKgPerDay((k) => Math.min(500, k + 5));
                      triggerFirstChangeTracking();
                    }}
                    disabled={kgPerDay >= 500}
                    className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 disabled:opacity-30 cursor-pointer shadow-2xs"
                    aria-label="Increase kg per day"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider with visual gradient track */}
              <div className="pt-2">
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={kgPerDay}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setKgPerDay(Number(e.target.value));
                    triggerFirstChangeTracking();
                  }}
                  style={{
                    background: `linear-gradient(to right, #487537 0%, #487537 ${kgSliderPct}%, #E5E7EB ${kgSliderPct}%, #E5E7EB 100%)`,
                  }}
                  className="w-full accent-leaf cursor-pointer h-3 rounded-lg appearance-none bg-sand border border-ink/10"
                  aria-label="Daily produce volume slider"
                />
                <div className="flex justify-between text-[11px] text-ink-60 font-mono mt-1.5 px-0.5">
                  <span>5 kg (small)</span>
                  <span>100 kg</span>
                  <span>250 kg</span>
                  <span>500 kg (cluster)</span>
                </div>
              </div>

              {/* Quick volume jump pills */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] text-ink-60 mr-1">{t('calc.jump')}</span>
                {[20, 40, 80, 150, 250].map((quickKg) => (
                  <button
                    key={quickKg}
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      setKgPerDay(quickKg);
                      triggerFirstChangeTracking();
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium transition-all cursor-pointer ${
                      kgPerDay === quickKg
                        ? 'bg-leaf text-white font-bold shadow-2xs'
                        : 'bg-sand/70 text-ink hover:bg-sand border border-ink/10'
                    }`}
                  >
                    {quickKg} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4 & 5: Selling Price & Spoilage Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input 4: Selling price stepper */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                      4
                    </span>
                    Selling price
                  </label>
                  <span className="text-[11px] text-ink-60">{t('calc.mandi')}</span>
                </div>

                <div className="flex items-center justify-between bg-sand rounded-full p-1 border border-ink/10 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      setPricePerKg((p) => Math.max(5, p - 5));
                      triggerFirstChangeTracking();
                    }}
                    disabled={pricePerKg <= 5}
                    className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 disabled:opacity-30 cursor-pointer shadow-2xs"
                    aria-label="Decrease price per kg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-heading font-black text-lg text-ink select-none">
                    ₹{pricePerKg} <span className="text-xs text-ink-60 font-medium">/ kg</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      setPricePerKg((p) => p + 5);
                      triggerFirstChangeTracking();
                    }}
                    className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label="Increase price per kg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-60 pt-0.5">
                  <span className="italic">
                    {activeCrop.name} default: ₹{activeCrop.defaultPricePerKg}/kg
                  </span>
                  <button
                    type="button"
                    onClick={() => setPricePerKg(activeCrop.defaultPricePerKg)}
                    className="text-leaf hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Input 5: Spoilage slider */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                      5
                    </span>
                    Spoilage today
                  </label>
                  <span className="font-heading font-extrabold text-sm text-chilli bg-chilli-light px-2.5 py-0.5 rounded-full border border-chilli/20">
                    {spoilagePct}% loss
                  </span>
                </div>
                <p className="text-[11px] text-ink-60">
                  Produce thrown away or distress-discounted
                </p>

                <div className="pt-2">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={spoilagePct}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setSpoilagePct(Number(e.target.value));
                      triggerFirstChangeTracking();
                    }}
                    style={{
                      background: `linear-gradient(to right, #EC2727 0%, #EC2727 ${spoilageSliderPct}%, #E5E7EB ${spoilageSliderPct}%, #E5E7EB 100%)`,
                    }}
                    className="w-full accent-chilli cursor-pointer h-2.5 rounded-lg appearance-none bg-sand border border-ink/10"
                    aria-label="Current spoilage percentage slider"
                  />
                  <div className="flex justify-between text-[11px] text-ink-60 font-mono mt-1 px-0.5">
                    <span>0% (no loss)</span>
                    <span>25% (typical)</span>
                    <span>50% (severe)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input 6: Selling days per month */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                    6
                  </span>
                  Selling days per month
                </label>
                <span className="text-[11px] text-ink-60">
                  Active mandi, auction, or market trading days (1 to 31)
                </span>
              </div>

              <div className="flex items-center bg-sand rounded-full p-1 border border-ink/10 self-start sm:self-auto shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setActivePresetId(null);
                    setDaysPerMonth((d) => Math.max(1, d - 1));
                    triggerFirstChangeTracking();
                  }}
                  disabled={daysPerMonth <= 1}
                  className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 disabled:opacity-30 cursor-pointer shadow-2xs"
                  aria-label="Decrease selling days"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-20 text-center font-heading font-bold text-sm text-ink select-none">
                  {daysPerMonth} days
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePresetId(null);
                    setDaysPerMonth((d) => Math.min(31, d + 1));
                    triggerFirstChangeTracking();
                  }}
                  disabled={daysPerMonth >= 31}
                  className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center hover:bg-sand transition-all active:scale-95 disabled:opacity-30 cursor-pointer shadow-2xs"
                  aria-label="Increase selling days"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Input 7: ColdEasy Hardware Choice */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-bold flex items-center justify-center">
                      7
                    </span>
                    ColdEasy Hardware Choice
                  </label>
                  <span className="text-[11px] text-ink-60">
                    Select your cooling format to calculate capacity and ROI
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CALCULATOR_PRODUCTS.map((prod) => {
                  const isSelected = selectedProductId === prod.productId;
                  const catProd = PRODUCTS.find((p) => p.id === prod.productId);
                  return (
                    <button
                      key={prod.productId}
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setSelectedProductId(prod.productId);
                        triggerFirstChangeTracking();
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-leaf bg-leaf-light/40 shadow-xs ring-2 ring-leaf/40'
                          : 'border-ink/10 bg-sand/60 hover:border-ink/30 hover:bg-sand'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-heading font-black text-sm text-ink">
                            {prod.name}
                          </span>
                          {isSelected ? (
                            <span className="w-6 h-6 rounded-full bg-leaf text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full border border-ink/20 bg-white" />
                          )}
                        </div>
                        <p className="text-xs text-ink-60">
                          Capacity: ~{prod.capacityKg} kg per unit
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between text-xs">
                        <span className="font-heading font-extrabold text-ink text-sm">
                          ₹{(catProd?.price ?? 3990).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-leaf font-medium flex items-center gap-1">
                          <ZapOff className="w-3 h-3" />
                          0W power
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Units Stepper & Capacity Feedback */}
              <div className="p-4 rounded-2xl bg-sand/70 border border-ink/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-ink space-y-0.5">
                  <p className="font-heading font-bold text-ink">
                    Units required: {units} {units === 1 ? 'unit' : 'units'}
                  </p>
                  <p className="text-ink-60 text-[11px]">
                    Total capacity: {calculations.totalCapacity} kg/day (
                    {Math.min(100, Math.round((calculations.totalCapacity / kgPerDay) * 100))}% of
                    your daily volume)
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {kgPerDay > capacityPerUnit && units !== recommendedUnits && (
                    <button
                      type="button"
                      onClick={() => {
                        setUnits(recommendedUnits);
                        triggerFirstChangeTracking();
                      }}
                      className="px-2.5 py-1.5 rounded-full bg-marigold-light border border-marigold/30 text-ink text-[11px] font-heading font-bold hover:bg-marigold/30 transition-all cursor-pointer"
                    >
                      Use Recommended ({recommendedUnits})
                    </button>
                  )}

                  <div className="flex items-center bg-white rounded-full p-1 border border-ink/20 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        setUnits((u) => Math.max(1, u - 1));
                        triggerFirstChangeTracking();
                      }}
                      disabled={units <= 1}
                      className="w-8 h-8 rounded-full bg-sand text-ink flex items-center justify-center hover:bg-sand/80 disabled:opacity-30 cursor-pointer active:scale-95"
                      aria-label="Decrease units"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-heading font-bold text-xs text-ink px-3 select-none">
                      {units}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUnits((u) => u + 1);
                        triggerFirstChangeTracking();
                      }}
                      className="w-8 h-8 rounded-full bg-sand text-ink flex items-center justify-center hover:bg-sand/80 cursor-pointer active:scale-95"
                      aria-label="Increase units"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: Output Card (Sticky on desktop) */}
          {/* ========================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-lg space-y-6">
              {/* Persona Context & Timeframe Switch */}
              <div>
                <p className="text-xs sm:text-sm text-ink-60 font-body leading-relaxed">
                  {personaIntro}
                </p>

                {/* Timeframe Toggle */}
                <div className="mt-3.5 flex items-center p-1 rounded-full bg-sand border border-ink/10">
                  <button
                    type="button"
                    onClick={() => setTimeframe('monthly')}
                    className={`flex-1 py-1.5 px-3 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                      timeframe === 'monthly'
                        ? 'bg-ink text-cream shadow-xs'
                        : 'text-ink-60 hover:text-ink'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe('seasonal')}
                    className={`flex-1 py-1.5 px-3 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                      timeframe === 'seasonal'
                        ? 'bg-ink text-cream shadow-xs'
                        : 'text-ink-60 hover:text-ink'
                    }`}
                  >
                    Season (4 mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe('annual')}
                    className={`flex-1 py-1.5 px-3 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                      timeframe === 'annual'
                        ? 'bg-ink text-cream shadow-xs'
                        : 'text-ink-60 hover:text-ink'
                    }`}
                  >
                    Full Year
                  </button>
                </div>

                {/* Hero Number (Large Montserrat in leaf) */}
                <div className="mt-4 p-4 rounded-2xl bg-leaf-light/40 border border-leaf/25">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-leaf block">
                    {t('calc.retained')}
                  </span>
                  <div className="text-3xl sm:text-4xl font-heading font-black text-leaf tracking-tight mt-1">
                    ₹{calculations.savedLow.toLocaleString('en-IN')} – ₹
                    {calculations.savedHigh.toLocaleString('en-IN')}
                    <span className="text-xs sm:text-sm font-semibold text-ink-60 block sm:inline sm:ml-1">
                      {timeframe === 'annual'
                        ? t('calc.per_year')
                        : timeframe === 'seasonal'
                          ? t('calc.per_season')
                          : t('calc.per_month')}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-60 mt-1">
                    {t('calc.deduct', {
                      amount: (
                        calculations.totalRunningCost * calculations.timeframeMultiplier
                      ).toLocaleString('en-IN'),
                    })}
                  </p>
                </div>

                {/* Verified Field Benchmark Note */}
                <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-leaf-light/40 border border-leaf/25 text-xs text-ink">
                  <Sparkles className="w-4 h-4 text-leaf shrink-0" />
                  <span className="font-heading font-medium text-[11px] text-ink-80">
                    {t('calc.shelf')}
                  </span>
                </div>

                {/* Disclaimer */}
                <p className="mt-2 text-[11px] text-ink-60 leading-relaxed font-body">
                  {t('calc.disclaimer')}
                </p>
              </div>

              {/* Enhanced Visual Comparison: Before vs After Cards */}
              <div className="p-4 rounded-2xl bg-sand/60 border border-ink/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-ink">
                  <span>{t('calc.before')}</span>
                  <span className="text-leaf">
                    {timeframe === 'annual'
                      ? 'Annualized'
                      : timeframe === 'seasonal'
                        ? '4-Month Cycle'
                        : 'Monthly'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Without ColdEasy */}
                  <div className="p-3 rounded-xl bg-chilli-light/60 border border-chilli/20 text-left">
                    <span className="text-[10px] font-heading font-bold text-chilli uppercase tracking-wider block">
                      Without ColdEasy
                    </span>
                    <span className="text-base sm:text-lg font-heading font-black text-chilli mt-0.5 block">
                      ₹{calculations.lossDisplay.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-chilli font-medium block">
                      Lost to spoilage (
                      {calculations.monthlyLossKg * calculations.timeframeMultiplier} kg)
                    </span>
                  </div>

                  {/* With ColdEasy */}
                  <div className="p-3 rounded-xl bg-leaf-light border border-leaf/30 text-left">
                    <span className="text-[10px] font-heading font-bold text-leaf uppercase tracking-wider block">
                      With ColdEasy
                    </span>
                    <span className="text-base sm:text-lg font-heading font-black text-leaf mt-0.5 block">
                      ₹{calculations.savedLow.toLocaleString('en-IN')}+
                    </span>
                    <span className="text-[10px] text-leaf font-medium block">
                      Kept in your pocket
                    </span>
                  </div>
                </div>

                {/* Visual Spectrum Bar */}
                <div className="pt-1 space-y-1">
                  <div className="flex justify-between text-[11px] text-ink font-medium">
                    <span className="text-leaf font-semibold">
                      Value Retained ({calculations.savedPct}%)
                    </span>
                    <span className="text-chilli font-semibold">
                      Residual Spoilage ({calculations.remainingPct}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-chilli-light rounded-full overflow-hidden flex border border-ink/10">
                    <div
                      className="h-full bg-leaf rounded-l-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(15, calculations.savedPct))}%` }}
                    />
                    <div
                      className="h-full bg-chilli/30 rounded-r-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, 100 - Math.min(100, Math.max(15, calculations.savedPct)))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-ink-60 text-center pt-0.5">
                    Recover up to {calculations.highReductionPct}% of current crop loss
                  </p>
                </div>
              </div>

              {/* Two key stat tiles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-sand/60 border border-ink/5">
                  <div className="flex items-center gap-1.5 text-[11px] font-heading font-semibold text-ink-60 uppercase tracking-wider">
                    <Scale className="w-3.5 h-3.5 text-leaf" />
                    <span>{t('calc.saved')}</span>
                  </div>
                  <span className="text-base sm:text-lg font-heading font-black text-ink mt-1.5 block">
                    {calculations.produceSavedLow}–{calculations.produceSavedHigh} kg
                  </span>
                  <span className="text-[10px] text-ink-40">
                    {timeframe === 'annual'
                      ? 'per year'
                      : timeframe === 'seasonal'
                        ? 'per season'
                        : 'per month'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand/60 border border-ink/5">
                  <div className="flex items-center gap-1.5 text-[11px] font-heading font-semibold text-ink-60 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-marigold" />
                    <span>{t('calc.pays')}</span>
                  </div>
                  <span className="text-sm sm:text-base font-heading font-black text-ink mt-1.5 block leading-tight">
                    {calculations.isPaybackOverYear
                      ? 'More than a year'
                      : `In ${calculations.paybackText}`}
                  </span>
                  <span className="text-[10px] text-ink-40">
                    {calculations.isPaybackOverYear
                      ? 'at this volume'
                      : `on ₹${calculations.totalInvestment.toLocaleString('en-IN')} total hardware`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                {/* Buy Button */}
                <button
                  type="button"
                  onClick={handleBuy}
                  className="w-full py-4 px-6 rounded-full bg-leaf text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Buy {activeProductAssumption.name}{' '}
                    {units > 1
                      ? `(${units} units · ₹${calculations.totalInvestment.toLocaleString('en-IN')})`
                      : `(₹${calculations.totalInvestment.toLocaleString('en-IN')})`}
                  </span>
                </button>

                {/* WhatsApp Estimate Button (Authentic WhatsApp Green #25D366) */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 px-6 rounded-full bg-[#25D366] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#20ba59] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('calc.wa')}</span>
                </button>

                {/* Bulk quote link for FPO or > 150 kg/day */}
                {isBulkRecommended && (
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={handleBulkQuote}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-leaf hover:underline cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{t('calc.fpo')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible "How we calculate this" drawer */}
              <div className="pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
                  className="w-full flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-ink-60 hover:text-ink cursor-pointer py-1"
                  aria-expanded={isFormulaExpanded}
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-sky" />
                    How we calculate this (Transparent Math)
                  </span>
                  {isFormulaExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isFormulaExpanded && (
                  <div className="mt-3 p-4 rounded-2xl bg-sand/70 text-xs text-ink space-y-3 font-body animate-in fade-in duration-200 border border-ink/5">
                    <div className="space-y-1">
                      <span className="font-heading font-bold text-[11px] uppercase tracking-wider block text-ink">
                        1. Produce capacity & volume covered
                      </span>
                      <p className="text-ink-60 text-[11px]">
                        Lesser of your {t('calc.per_day', { kg: kgPerDay })} and {units} × {capacityPerUnit} kg capacity
                        = {calculations.kgCovered} kg/day covered.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-heading font-bold text-[11px] uppercase tracking-wider block text-ink">
                        2. Baseline spoilage loss today
                      </span>
                      <p className="text-ink-60 text-[11px]">
                        {kgPerDay} kg × {spoilagePct}% spoilage × ₹{pricePerKg}/kg × {daysPerMonth}{' '}
                        days = ₹{calculations.lossToday.toLocaleString('en-IN')}/month.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-heading font-bold text-[11px] uppercase tracking-wider block text-ink">
                        3. Conservative spoilage reduction factor
                      </span>
                      <p className="text-ink-60 text-[11px]">
                        {activeCrop.name} baseline tests show {calculations.lowReductionPct}% to{' '}
                        {calculations.highReductionPct}% reduction in spoilage rate (placeholder
                        field rate).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-heading font-bold text-[11px] uppercase tracking-wider block text-ink">
                        4. Running cost deduction
                      </span>
                      <p className="text-ink-60 text-[11px]">
                        Subtracted ₹{calculations.totalRunningCost}/month for {units} unit(s) (tap
                        water refill and periodic pad care).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-heading font-bold text-[11px] uppercase tracking-wider block text-ink">
                        5. Payback period math
                      </span>
                      <p className="text-ink-60 text-[11px]">
                        Total hardware investment (₹
                        {calculations.totalInvestment.toLocaleString('en-IN')}) divided by daily net
                        savings.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
