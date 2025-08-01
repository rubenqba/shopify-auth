import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ngrok-free.app", "*.ngrok-free.app"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
