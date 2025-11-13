/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' }
  },
  // Disable Edge Runtime for API routes
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },
  // Ensure API routes don't use Edge Runtime
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    }
  },
  // Disable static optimization to avoid Edge Runtime issues
  output: 'standalone'
};

module.exports = nextConfig;
