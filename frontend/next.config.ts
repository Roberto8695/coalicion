import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'localhost', 'coalicion.onrender.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "coalicion.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  // Configuración de rewrites para hacer proxy a la API del backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  // Configuración para deployment
  output: 'standalone', // Para optimizar el build
};

export default nextConfig;
