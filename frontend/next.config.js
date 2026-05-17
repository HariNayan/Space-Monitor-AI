/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov',
      },
      {
        protocol: 'http',
        hostname: 'mars.jpl.nasa.gov',
      },
    ],
  },
};

export default nextConfig;
