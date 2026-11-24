export {};

/**
 * Gate 7 (docs/02 §8): no broken internal link. Crawls a running site from BASE_URL
 * (default http://localhost:3000), following same-origin links, images, video sources and
 * posters. --external also checks external links with HEAD (media links must not error).
 * WhatsApp, tel: and mailto: links are not fetched.
 */
const base = new URL(process.env.BASE_URL ?? 'http://localhost:3000');
const external = process.argv.includes('--external');
const auth = process.env.STAGING_BASIC_AUTH
  ? { Authorization: `Basic ${Buffer.from(process.env.STAGING_BASIC_AUTH).toString('base64')}` }
  : undefined;

const seen = new Map<string, number>();
const referrers = new Map<string, string>();
const queue: string[] = [base.href];
const broken: string[] = [];

const ATTR = /\s(?:href|src|poster|srcSet|srcset)="([^"]+)"/g;

function urlsIn(html: string, page: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(ATTR)) {
    const raw = m[1]!.replace(/&amp;/g, '&');
    for (const part of raw.split(',')) {
      const candidate = part.trim().split(/\s+/)[0];
      if (!candidate || /^(mailto:|tel:|data:|blob:|#|javascript:)/.test(candidate)) continue;
      try {
        out.push(new URL(candidate, page).href.split('#')[0]!);
      } catch {
        /* ignore */
      }
    }
  }
  return out;
}

async function main() {
  while (queue.length) {
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    const u = new URL(url);
    const internal = u.origin === base.origin;
    if (!internal && (!external || /wa\.me|whatsapp\.com/.test(u.host))) {
      seen.set(url, 0);
      continue;
    }
    let res: Response;
    try {
      res = await fetch(url, {
        method: internal ? 'GET' : 'HEAD',
        headers: internal ? auth : undefined,
        redirect: 'follow',
      });
    } catch (e) {
      seen.set(url, -1);
      broken.push(`${url} (network error ${String(e)}) from ${referrers.get(url)}`);
      continue;
    }
    seen.set(url, res.status);
    if (res.status >= 400) {
      broken.push(`${res.status} ${url} from ${referrers.get(url) ?? '(start)'}`);
      continue;
    }
    if (internal && (res.headers.get('content-type') ?? '').includes('text/html')) {
      for (const next of urlsIn(await res.text(), url)) {
        if (!seen.has(next)) {
          referrers.set(next, referrers.get(next) ?? url);
          queue.push(next);
        }
      }
    }
  }
  const checked = [...seen.values()].filter((s) => s !== 0).length;
  console.log(`[links] checked ${checked} URL(s), ${broken.length} broken`);
  broken.forEach((b) => console.log(`  ${b}`));
  if (broken.length) process.exit(1);
}

void main();
