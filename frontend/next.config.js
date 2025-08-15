/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'http://storetrack-api:3000/api/:path*' 
          : 'http://localhost:3000/api/:path*'
      }
    ]
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
  }
}

module.exports = nextConfig