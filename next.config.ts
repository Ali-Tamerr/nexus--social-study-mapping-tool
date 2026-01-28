import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Expose the private API URL as public to the client if not already set
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PRIVATE_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
