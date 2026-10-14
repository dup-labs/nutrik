import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só vale em `next dev`: o emulador Android enxerga a máquina em 10.0.2.2,
  // e o Next bloqueia recursos de dev pra origens que não são localhost.
  allowedDevOrigins: ["10.0.2.2"],
};

export default nextConfig;
