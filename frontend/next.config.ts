import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
     domains: ['res.cloudinary.com', 'localhost'],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
  ],
  },
};

export default nextConfig;
