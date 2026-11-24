/**
 * Gate 2 (docs/02 §8, docs/08 §D): claims.
 * - Every claim id a page references must exist in content/claims.json.
 * - In production, a referenced claim must be approved, with evidence and an approver.
 * - Always: known invented or unsourced figures from the prototype and the brief may not appear
 *   in site code or copy unless their claim is approved (docs/11 A7).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, STRICT, report, scan, walk, type Finding } from './lib';

type Claim = {
  id: string;
  status: 'unverified' | 'approved' | 'retired';
  evidenceRef: string | null;
  approvedBy: string | null;
};
const register: Claim[] = JSON.parse(
  readFileSync(join(ROOT, 'content/claims.json'), 'utf8'),
).claims;
const byId = new Map(register.map((c) => [c.id, c]));
const approved = (id: string) => {
  const c = byId.get(id);
  return !!c && c.status === 'approved' && !!c.evidenceRef && !!c.approvedBy;
};

const files = [
  ...walk(join(ROOT, 'content'), ['.json', '.md', '.mdx']),
  ...walk(join(ROOT, 'app'), ['.ts', '.tsx']),
  ...walk(join(ROOT, 'components'), ['.ts', '.tsx']),
].filter((f) => !f.endsWith('claims.json'));

/** Figures the prototype or brief used without a source, and the claim that would allow them. */
export const BANNED: Array<{ claim: string; re: RegExp }> = [
  { claim: 'C-01', re: /\b4\.(9|85|95|87|88)\b\s*(★|stars?|\/\s*5|rating)/i },
  { claim: 'C-05', re: /\b1[0-5]\s*(–|-|to)\s*15\s*°?\s*C\b|cooling delta/i },
  { claim: 'C-06', re: /\b8\s*(–|-|to)\s*10\s*days\b/i },
  { claim: 'C-07', re: /\b(up to )?2\s*[x×]\s*(shelf|longer)/i },
  { claim: 'C-08', re: /\b3\.5\s*[x×]\s*faster/i },
  { claim: 'C-09', re: /\b90\s*%\s*(relative )?humidity|\bRH\s*90/i },
  { claim: 'C-11', re: /\b80\s*%\s*lower weight loss/i },
  { claim: 'C-18', re: /\b100\s*%\s*food[- ]safe/i },
  { claim: 'C-19', re: /\b900\+?\s*units/i },
  { claim: 'C-20', re: /\b400\+?\s*households/i },
  { claim: 'C-21', re: /\b900\+?\s*tonnes/i },
  { claim: 'C-22', re: /₹?\s*480\s*lakh/i },
  { claim: 'C-23', re: /\bpatented\b/i },
  { claim: 'C-25', re: /\b1\.3\s*billion tonnes/i },
  { claim: 'C-27', re: /\b13\s*%\s*(remaining )?(saleable|marketab)/i },
  { claim: 'C-27', re: /\b15\s*%\s*water weight/i },
];

const findings: Finding[] = [];

// 1. Referenced ids exist (and are approved in production).
for (const f of scan(files, [{ rule: 'claim-ref', re: /claim(Id|_id)?\s*[:=]\s*['"{]*C-\d{2}/ }])) {
  for (const m of f.text.matchAll(/C-\d{2}/g)) {
    const id = m[0];
    if (!byId.has(id)) findings.push({ ...f, rule: `unknown claim ${id}` });
    else if (STRICT && !approved(id)) findings.push({ ...f, rule: `claim ${id} not approved` });
  }
}

// 2. Banned unsourced figures.
for (const { claim, re } of BANNED) {
  if (approved(claim)) continue;
  findings.push(...scan(files, [{ rule: `unsourced figure (${claim})`, re }]));
}

report('claims', findings, { strictOnly: false });
