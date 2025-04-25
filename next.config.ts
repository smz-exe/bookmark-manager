import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows images from any domain
      },
      {
        protocol: 'http',
        hostname: '**', // This also allows HTTP images
      },
    ],
  },
};

export default nextConfig;
