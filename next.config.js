/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const ingestBase = process.env.NEXT_PUBLIC_INGEST_BASE_URL || 'http://localhost:4001';
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
};

export default nextConfig;
