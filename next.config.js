/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "user-images.githubusercontent.com",
      "lh3.googleusercontent.com",
      "en.wikipedia.org",
      "upload.wikimedia.org",
      "links.papareact.com",
      "i.pinimg.com",
    ],
  },
};

module.exports = nextConfig;
