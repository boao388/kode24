import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false,
  },
  compiler: {
    removeConsole: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,   // 빌드 시 타입오류 무시
  },
};

export default nextConfig;
