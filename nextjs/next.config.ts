import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // CSS 최적화 비활성화 (빌드 에러 방지)
    optimizeCss: false,
    // 런타임 최적화
    optimizePackageImports: ['@tanstack/react-query'],
  },
  // 서버 외부 패키지 설정 (Next.js 15+ 방식)
  serverExternalPackages: ['@prisma/client'],
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 이미지 최적화 설정
  images: {
    // 성능 향상을 위한 이미지 형식 우선순위
    formats: ['image/webp', 'image/avif'],
    // 이미지 크기 최적화
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 원격 이미지 패턴
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'expqjhfhpltpkiwghxyi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 이미지 로더 최적화
    loader: 'default',
    // 지연 로딩 활성화
    dangerouslyAllowSVG: false,
  },
  // 성능 최적화 설정
  poweredByHeader: false, // X-Powered-By 헤더 제거
  compress: true, // gzip 압축 활성화
  
  // 캐싱 최적화
  onDemandEntries: {
    // 개발 시 페이지 캐싱 시간 (밀리초)
    maxInactiveAge: 25 * 1000,
    // 동시에 유지할 페이지 수
    pagesBufferLength: 2,
  },
  
  // 웹팩 최적화
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 프로덕션 빌드 최적화
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 벤더 라이브러리 분리
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // React Query 별도 청크
          reactQuery: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query/,
            name: 'react-query',
            chunks: 'all',
            priority: 20,
          },
          // 공통 컴포넌트 분리
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }
    
    return config;
  },
  
  // 헤더 최적화
  async headers() {
    return [
      {
        // 정적 자산에 대한 캐싱 헤더
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 이미지에 대한 캐싱 헤더
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API 라우트 캐싱 헤더
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
