/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tokentrail.xyz';
    const ingestBase = process.env.INGEST_BASE_URL || process.env.NEXT_PUBLIC_INGEST_BASE_URL || 'https://ingest.tokentrail.xyz';

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiBase}/v1/:path*`,
      },
      {
        source: '/ingest/v1/:path*',
        destination: `${ingestBase}/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

