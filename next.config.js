/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,

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

  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          mui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            name: 'mui',
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-query|react-redux|react-hook-form)[\\/]/,
            name: 'react',
            chunks: 'all',
            enforce: true,
          },
          maps: {
            test: /[\\/]node_modules[\\/](@react-google-maps|@googlemaps|google-maps)[\\/]/,
            name: 'maps',
            chunks: 'async',
            enforce: true,
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            chunks: 'async',
            enforce: true,
          },
          components: {
            test: /[\\/]src[\\/]components/,
            name(module) {
              const path = module.context || '';
              if (path.includes('landing-page')) return 'landing';
              if (path.includes('checkout')) return 'checkout';
              if (path.includes('auth')) return 'auth';
              if (path.includes('profile')) return 'profile';
              return 'components';
            },
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }

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
