import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, isLiveLocale, isLocale } from '@/lib/i18n/config';

/**
 * Runs before every page request:
 * 1. Password-protects preview and staging (B1-04, docs/02 §6) with HTTP Basic auth when
 *    STAGING_BASIC_AUTH ("user:password") is set. Production never sets it.
 * 2. Adds X-Robots-Tag: noindex everywhere except production.
 * 3. Locale routing (docs/03 §6, docs/11 A6): English at the root, other live languages
 *    under /hi/..., internally rewritten to /en/... so pages stay statically generated.
 */
export function proxy(request: NextRequest) {
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
  const basicAuth = process.env.STAGING_BASIC_AUTH;

  if (!isProduction && basicAuth && !isAuthorised(request, basicAuth)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ColdEasy staging", charset="UTF-8"',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];
  let response: NextResponse;

  if (first === DEFAULT_LOCALE) {
    // /en/science -> /science (one canonical URL per page)
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/';
    response = NextResponse.redirect(url, 308);
  } else if (isLiveLocale(first)) {
    response = NextResponse.next();
  } else if (isLocale(first)) {
    // A language that exists but is not approved yet: send people to English.
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(first.length + 1) || '/';
    response = NextResponse.redirect(url, 307);
  } else {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
    response = NextResponse.rewrite(url);
  }

  if (!isProduction) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

function isAuthorised(request: NextRequest, expected: string): boolean {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  return timingSafeEqual(decoded, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export const config = {
  // Everything except Next internals, API routes and files with an extension (images, video, fonts).
  matcher: ['/((?!_next/|api/|.*\\.[\\w]+$).*)'],
};
