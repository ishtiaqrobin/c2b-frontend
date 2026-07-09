import "./src/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        // NEXT_PUBLIC_AUTH_URL is already https://...api/auth
        // so destination must be NEXT_PUBLIC_AUTH_URL/:path*
        // NOT NEXT_PUBLIC_AUTH_URL/api/auth/:path* (that doubles the path!)
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/:path*`,
      },
      {
        // Proxy API v1 requests to the backend
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
