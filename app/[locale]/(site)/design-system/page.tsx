import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isProduction } from '@/lib/env';
import { contrastRatio } from '@/lib/contrast';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PlaceholderPill } from '@/components/ui/PlaceholderPill';
import { SoldOutBadge, Tag } from '@/components/ui/Badge';
import { Logo } from '@/components/ui/Logo';
import { SeedGrid } from '@/components/ui/Pattern';
import { DesignSystemForm } from './DesignSystemForm';

/**
 * Staging-only design system sheet (B1-08) so ColdEasy and Orello can review tokens and
 * components in the browser. Returns 404 in production. Copy here is reviewer-facing, not
 * site copy, so it is not in the locale file.
 */
export const metadata: Metadata = { title: 'Design system' };

const PALETTE = [
  ['ink', '#251A10'],
  ['sky', '#6FCCDD'],
  ['leaf', '#487537'],
  ['olive', '#9FA738'],
  ['marigold', '#F0A023'],
  ['chilli', '#EC2727'],
  ['cream', '#FCFBF1'],
  ['sand', '#F5F3EC'],
  ['white', '#FFFFFF'],
  ['sky-light', '#E2F5F8'],
  ['leaf-light', '#E4EDE0'],
  ['marigold-light', '#FFEBB6'],
  ['ink-60', '#5E554E'],
  ['ink-40', '#A39E98'],
] as const;

function Swatch({ name, hex }: { name: string; hex: string }) {
  const onInk = contrastRatio(hex, '#251A10');
  const onWhite = contrastRatio(hex, '#FFFFFF');
  const text = onInk >= onWhite ? '#251A10' : '#FFFFFF';
  return (
    <li className="overflow-hidden rounded-2xl border border-line">
      <div
        className="flex h-20 items-end p-3 font-heading text-xl font-bold"
        style={{ background: hex, color: text }}
      >
        {name}
      </div>
      <div className="bg-surface-raised p-3 text-[13px]">
        <div className="font-medium">{hex}</div>
        <div className="text-fg-muted">
          ink text {onInk.toFixed(1)}:1 · white text {onWhite.toFixed(1)}:1
        </div>
      </div>
    </li>
  );
}

function Samples() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="font-heading text-4xl leading-[1.1] font-extrabold md:text-6xl">
          Display 36 / 64
        </p>
        <h1 className="font-heading text-[2rem] font-bold md:text-[3.5rem]">Heading 1 · 32 / 56</h1>
        <SectionHeading description="Section heading with the accent bar. Uppercase, +2% tracking.">
          Heading 2 · 24 / 36
        </SectionHeading>
        <h3 className="font-heading text-xl font-semibold md:text-2xl">Heading 3 · 20 / 24</h3>
        <p className="max-w-[70ch]">
          Body · Poppins 16 / 17, line height 1.5, at most 70 characters a line. Body copy is ink on
          cream, or cream on ink on the dark home page.
        </p>
        <p className="text-[13px] text-fg-muted md:text-sm">Caption · 13 / 14, never smaller.</p>
        <p className="font-heading text-[1.75rem] font-bold md:text-4xl">
          ₹0,000 <span className="text-[60%] font-semibold text-fg-muted line-through">₹0,000</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Buy now</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="whatsapp">Connect on WhatsApp</Button>
        <Button disabled>Disabled</Button>
        <ButtonLink href="/" variant="ghost">
          Ghost link
        </ButtonLink>
        <Button size="sm">Small</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SoldOutBadge label="Sold out" />
        <Tag label="Tag" />
        <PlaceholderPill>[X–Y] °C, to be verified</PlaceholderPill>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="font-heading text-xl font-semibold">Card</h3>
          <p className="mt-2 text-fg-muted">White, 24 px radius, the one soft shadow.</p>
        </Card>
        <Card className="relative overflow-hidden">
          <SeedGrid id="seed-grid-card" opacity={0.1} />
          <p className="relative">Seed-grid pattern. Decorative, never behind a product image.</p>
        </Card>
      </div>

      <DesignSystemForm />
    </div>
  );
}

export default function DesignSystemPage() {
  if (isProduction) notFound();
  return (
    <>
      <section className="section-y">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading
            as="h1"
            description="Tokens from docs/04 §4. Brand-book values; sky is #6FCCDD."
          >
            Design system
          </SectionHeading>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PALETTE.map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-8">
            <Logo variant="color" height={44} alt="ColdEasy logo, colour" />
            <Logo variant="symbol" height={45} alt="ColdEasy symbol" />
          </div>
          <Samples />
        </div>
      </section>
      <section data-theme="dark" className="section-y bg-surface text-fg">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading description="The same components on the dark home theme (docs/11 A5).">
            Dark theme
          </SectionHeading>
          <Logo variant="reversed" height={44} alt="ColdEasy logo, reversed" />
          <Samples />
        </div>
      </section>
    </>
  );
}
