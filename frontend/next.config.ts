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
  // Configuración para deployment
  output: 'standalone', // Para optimizar el build
  
  // Suprimir warnings de hydration en desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  // Configuración experimental para manejar hydration
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
