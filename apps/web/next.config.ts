import type { NextConfig } from 'next';

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: isExport
    ? 'export'
    : process.env.VERCEL
    ? undefined
    : process.env.NEXT_OUTPUT_STANDALONE === 'true' ||
      (process.env.NODE_ENV === 'production' && process.platform !== 'win32')
    ? 'standalone'
    : undefined,

  // Transpile workspace packages
  transpilePackages: ['@dehradun/contracts'],

  // Security headers (only when not exporting static files)
  headers: isExport
    ? undefined
    : async () => [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ],

  // Remote Image Patterns for curated high-res travel photography
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },

  // Ensure server-only env vars are NOT exposed to the client
  env: {},
};

export default nextConfig;
