/**
 * Prints what drove each Lighthouse run's LCP, so a CI failure can be diagnosed from the
 * job log alone: page, LCP, FCP, the LCP element, its breakdown and the host benchmark.
 * Usage: tsx scripts/gates/lighthouse-summary.ts [.lighthouseci]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type Item = Record<string, unknown> & { items?: Item[]; type?: string };
type Lhr = {
  finalDisplayedUrl: string;
  environment: { benchmarkIndex: number; hostUserAgent: string };
  audits: Record<string, { numericValue?: number; details?: Item }>;
};

const dir = process.argv[2] ?? '.lighthouseci';
const files = readdirSync(dir).filter((f) => f.startsWith('lhr-') && f.endsWith('.json'));

for (const file of files) {
  const lhr = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Lhr;
  const a = lhr.audits;
  const ms = (k: string) => Math.round(a[k]?.numericValue ?? NaN);
  const parts = a['lcp-breakdown-insight']?.details?.items ?? [];
  const table = parts.find((p) => p.type === 'table')?.items ?? [];
  const node = parts.find((p) => p.type === 'node');
  console.log(
    `${lhr.finalDisplayedUrl} LCP ${ms('largest-contentful-paint')} ms, FCP ${ms('first-contentful-paint')} ms, TBT ${ms('total-blocking-time')} ms, benchmark ${lhr.environment.benchmarkIndex}`,
  );
  console.log(`  element: ${String(node?.selector ?? 'unknown')}`);
  console.log(
    `  breakdown: ${table.map((r) => `${String(r.subpart)} ${Math.round(Number(r.duration))}`).join(', ')}`,
  );
}

export {};
