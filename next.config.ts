/** @type {import('next').NextConfig} */
const nextConfig = {
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
