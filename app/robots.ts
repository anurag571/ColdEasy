import type { MetadataRoute } from 'next';
import { isProduction, publicEnv } from '@/lib/env';

/** Only production is indexable. Preview and staging also send X-Robots-Tag: noindex. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cart', '/checkout', '/order'],
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
