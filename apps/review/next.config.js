/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Netlify
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: '/review',
  assetPrefix: '/review',
}

module.exports = nextConfig
