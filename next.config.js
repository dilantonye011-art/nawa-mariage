/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nawa-mariage-git-main-dilan-devweb.vercel.app',
          },
        ],
        destination: 'https://nawa-mariage.vercel.app/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nawa-mariage-r9l9w80xi-dilan-devweb.vercel.app',
          },
        ],
        destination: 'https://nawa-mariage.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
