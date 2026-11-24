import type { NextConfig } from 'next';
import { securityHeaders } from './lib/security/headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Branded 404 for unmatched URLs; the root layout lives under app/[locale].
    globalNotFound: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders({ isDev: process.env.NODE_ENV !== 'production' }),
      },
    ];
  },
};

export default nextConfig;
