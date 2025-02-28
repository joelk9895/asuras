/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Force single version of Three.js
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve("three"),
    };
    return config;
  },
};

module.exports = nextConfig;
