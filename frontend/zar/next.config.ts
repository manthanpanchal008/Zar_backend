import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: 'export',
   trailingSlash: true,
  images: {
    unoptimized: true,     // Required because normal servers can't resize images
  },
  /* config options here */
};

export default nextConfig;
