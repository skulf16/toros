import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
  experimental: {
    serverActions: {
      // Galerie-Upload: mehrere Handyfotos in einem Rutsch
      bodySizeLimit: "40mb",
    },
  },
};

export default nextConfig;
