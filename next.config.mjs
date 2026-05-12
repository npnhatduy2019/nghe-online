/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['ytsr', '@distube/ytdl-core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
