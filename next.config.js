/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Добавляем настройку для поддержки модуля async в middleware
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  }
};

module.exports = nextConfig;