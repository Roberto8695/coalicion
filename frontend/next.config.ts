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
  
  // Suprimir warnings de hydration en desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  // Configuración experimental para manejar hydration
  experimental: {
    // Configuraciones experimentales para reducir warnings
    optimizePackageImports: ['@tabler/icons-react'],
    // Suprimir warnings de hydration en desarrollo
    ...(process.env.NODE_ENV === 'development' && {
      forceSwcTransforms: true,
    }),
  },
  
  // Configuración para suprimir warnings en desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    logging: {
      fetches: {
        fullUrl: false,
      },
    },
    // Suprimir warnings específicos de React
    reactStrictMode: false,
  }),
  
  // Configurar outputFileTracingRoot para evitar warnings de lockfiles
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
