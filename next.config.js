/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dlh4vrbpe/**", // Ganti ini sesuai dengan cloud name kamu
      },
    ],
  },
};

module.exports = nextConfig;
