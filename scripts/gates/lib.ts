import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const ROOT = process.cwd();

/** Production fails hard; every other environment reports and passes (docs/11 rule 3). */
export const STRICT =
  process.argv.includes('--strict') || process.env.NEXT_PUBLIC_APP_ENV === 'production';

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'legacy-ai-studio',
  'docs',
  'test-results',
  'playwright-report',
  '.lighthouseci',
]);

export function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

export type Finding = { file: string; line: number; text: string; rule: string };

export function scan(files: string[], rules: Array<{ rule: string; re: RegExp }>): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((text, i) => {
      for (const { rule, re } of rules) {
        if (re.test(text))
          findings.push({
            file: relative(ROOT, file),
            line: i + 1,
            text: text.trim().slice(0, 160),
            rule,
          });
      }
    });
  }
  return findings;
}

export function report(name: string, findings: Finding[], { strictOnly }: { strictOnly: boolean }) {
  const fail = findings.length > 0 && (!strictOnly || STRICT);
  const tag = fail ? 'FAIL' : findings.length ? 'REPORT' : 'PASS';
  console.log(
    `[${name}] ${tag}: ${findings.length} finding(s)${strictOnly && !STRICT ? ' (staging mode: reported, not blocking)' : ''}`,
  );
  for (const f of findings.slice(0, 200))
    console.log(`  ${f.file}:${f.line}  [${f.rule}]  ${f.text}`);
  if (fail) process.exit(1);
}
