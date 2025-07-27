/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Web App optimizations
  output: 'standalone',
  
  // Enable compression for better performance
  compress: true,
  
  // Optimize images for Azure
  images: {
    unoptimized: true,
  },
  
  // Environment-specific settings
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },

  // Redirects for custom domain setup
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.desoscamreport.safetynet.social',
          },
        ],
        destination: 'https://desoscamreport.safetynet.social/$1',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
