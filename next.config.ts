import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Local network address used to preview this workspace during development.
  allowedDevOrigins: ["192.168.56.1"],
};

export default nextConfig;
