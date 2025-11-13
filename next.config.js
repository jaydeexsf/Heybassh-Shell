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

// Configure API route body parser size limit
module.exports = nextConfig;

// Add body parser configuration for API routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
};
