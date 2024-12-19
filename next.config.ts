/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignores all TS errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores all ESLint errors during build
  },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/a/**',
            search: '',
          },
          {
            protocol: 'https',
            hostname: 'github.com',
            port: '',
            pathname: '/**',
            search: '',
          },
        ],
      },
}

module.exports = nextConfig
