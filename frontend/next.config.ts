import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache API responses for 60 seconds — pages load from cache, not live API
  experimental: {
    staleTimes: {
      dynamic: 60,
    },
  },
};

export default nextConfig;
