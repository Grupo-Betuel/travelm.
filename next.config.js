/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
      },
    ],
  },
  i18n: {
    locales: ['es','en'],
    defaultLocale: 'es',
  },
}

module.exports = nextConfig
