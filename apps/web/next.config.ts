import "@my-better-t-app/env/web";
import type { NextConfig } from "next";

const SERVER_URL =
  process.env.SERVER_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "http://localhost:3001";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${SERVER_URL}/api/auth/:path*`,
      },
      {
        source: "/trpc/:path*",
        destination: `${SERVER_URL}/trpc/:path*`,
      },
    ];
  },
};

export default nextConfig;
