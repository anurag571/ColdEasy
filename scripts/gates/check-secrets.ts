/**
 * Gate 6 (docs/02 §7-8): server-only secrets never reach client code.
 * 1. A 'use client' module may not read a non-NEXT_PUBLIC_ env var or import a server-only module.
 * 2. No secret-looking literal anywhere in the repo (live keys, service-role JWTs, private keys).
 * 3. With --build: the browser bundle (.next/static) contains no server secret name or value.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, report, walk, type Finding } from './lib';

const SERVER_ONLY_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'TURNSTILE_SECRET_KEY',
  'REVALIDATE_SECRET',
  'STAGING_BASIC_AUTH',
  'ZOHO_CLIENT_ID',
  'ZOHO_CLIENT_SECRET',
  'ZOHO_REFRESH_TOKEN',
  'ZOHO_ORGANIZATION_ID',
];
const SERVER_MODULES =
  /from ['"](@\/lib\/env\.server|@\/lib\/supabase\/(admin|server)|server-only)['"]/;
const SECRET_LITERALS: Array<{ rule: string; re: RegExp }> = [
  { rule: 'razorpay live key', re: /rzp_live_[A-Za-z0-9]{10,}/ },
  { rule: 'razorpay test key', re: /rzp_test_[A-Za-z0-9]{10,}/ },
  { rule: 'private key', re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { rule: 'JWT', re: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { rule: 'resend key', re: /\bre_[A-Za-z0-9]{20,}/ },
  { rule: 'zoho refresh token', re: /\b1000\.[a-f0-9]{32}\.[a-f0-9]{32}\b/ },
];

const findings: Finding[] = [];
const code = ['app', 'components', 'lib'].flatMap((d) => walk(join(ROOT, d), ['.ts', '.tsx']));

for (const file of code) {
  const src = readFileSync(file, 'utf8');
  if (!/^\s*['"]use client['"]/.test(src)) continue;
  src.split('\n').forEach((text, i) => {
    for (const m of text.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      if (!m[1]!.startsWith('NEXT_PUBLIC_') && m[1] !== 'NODE_ENV')
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          text: text.trim(),
          rule: 'server env in client module',
        });
    }
    if (SERVER_MODULES.test(text))
      findings.push({
        file: relative(ROOT, file),
        line: i + 1,
        text: text.trim(),
        rule: 'server module in client module',
      });
  });
}

const everything = walk(ROOT, [
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.sql',
  '.md',
  '.yml',
  '.yaml',
  '.toml',
  '.env.example',
]).filter((f) => !f.endsWith('package-lock.json') && !f.includes('scripts/gates/check-secrets'));
for (const file of everything) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((text, i) => {
      for (const { rule, re } of SECRET_LITERALS) {
        // Supabase's well-known local demo keys are public; seed and tests may carry them.
        if (rule === 'JWT' && /supabase-demo|"iss":"supabase-demo"/.test(text)) continue;
        if (re.test(text))
          findings.push({
            file: relative(ROOT, file),
            line: i + 1,
            text: text.trim().slice(0, 80) + '…',
            rule,
          });
      }
    });
}

if (process.argv.includes('--build')) {
  const dir = join(ROOT, '.next/static');
  if (!existsSync(dir)) {
    console.error('[secrets] --build needs `next build` first');
    process.exit(1);
  }
  const values = SERVER_ONLY_NAMES.map((n) => [n, process.env[n]] as const).filter(
    ([, v]) => v && v.length >= 8,
  );
  for (const file of walk(dir, ['.js', '.css', '.html', '.json'])) {
    const src = readFileSync(file, 'utf8');
    for (const name of SERVER_ONLY_NAMES)
      if (src.includes(name))
        findings.push({
          file: relative(ROOT, file),
          line: 0,
          text: name,
          rule: 'server secret name in bundle',
        });
    for (const [name, value] of values)
      if (src.includes(value!))
        findings.push({
          file: relative(ROOT, file),
          line: 0,
          text: name,
          rule: 'server secret VALUE in bundle',
        });
  }
}

report('secrets', findings, { strictOnly: false });
