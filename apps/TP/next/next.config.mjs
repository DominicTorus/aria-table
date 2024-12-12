/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '192.168.2.165',
            pathname: '**',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '**',
          },
        ],
      },
};

export default nextConfig;
