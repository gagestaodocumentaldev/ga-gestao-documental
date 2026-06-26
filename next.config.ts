import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    proxyClientMaxBodySize: "100mb",
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.34.6.112",
    "192.168.1.33", // IP da sua máquina na rede
  ],
};

export default nextConfig;
