/**
 * Gate 1 (docs/02 §8, docs/11 rule 3): no [TBC] or [CONFIRM placeholder in published content.
 * Staging: lists every placeholder so the team can see what ColdEasy still owes.
 * Production (--strict or NEXT_PUBLIC_APP_ENV=production): fails the build if any remain.
 * Phase 6 adds the same check over content exported from the database.
 */
import { join } from 'node:path';
import { ROOT, report, scan, walk } from './lib';

const files = [
  ...walk(join(ROOT, 'content'), ['.json', '.md', '.mdx']),
  ...walk(join(ROOT, 'app'), ['.ts', '.tsx']),
  ...walk(join(ROOT, 'components'), ['.ts', '.tsx']),
  ...walk(join(ROOT, 'lib'), ['.ts', '.tsx']),
].filter((f) => !f.endsWith('claims.json'));

// Code that *detects* placeholders mentions the marker on purpose; it carries this tag.
// Comments in code are notes for developers, not published content.
const isComment = (text: string) => /^(\*|\/\/|\/\*)/.test(text);
const findings = scan(files, [{ rule: 'placeholder', re: /\[(TBC|CONFIRM)\b/ }]).filter(
  (f) =>
    !f.text.includes('placeholder-gate: ignore') &&
    !(f.file.endsWith('.tsx') || f.file.endsWith('.ts') ? isComment(f.text) : false),
);
report('placeholders', findings, { strictOnly: true });
