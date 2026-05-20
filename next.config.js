/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  // Enable source maps in production to reveal the actual file in errors
  productionBrowserSourceMaps: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Experimental features for better optimization
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      'date-fns',
    ],
  },

  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    root: __dirname,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://dz.bi3o.com/api/v1/:path*',
      },
    ];
  },

  async headers() {
    /** Dev + Turbopack: immutable static caching breaks HMR (stale chunks → "module factory is not available"). */
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, must-revalidate",
            },
          ],
        },
        {
          source: "/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, must-revalidate",
            },
          ],
        },
      ];
    }
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  compress: true,
  poweredByHeader: false,

  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all',
        },
      },
    };

    // Prevent moment.js from being bundled (replaced by dayjs)
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
