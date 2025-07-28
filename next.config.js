/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// next.config.js
module.exports = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

