/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { 
      bodySizeLimit: '2mb' 
    }
  },
  // Configure webpack to handle Node.js modules
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
  // Set output to standalone for better compatibility
  output: 'standalone'
};

module.exports = nextConfig;
