/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dlh4vrbpe/**", // Ganti ini sesuai cloud name kamu
      },
    ],
  },
  eslint: {
    // ⛔ Nonaktifkan lint saat build di Vercel
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
