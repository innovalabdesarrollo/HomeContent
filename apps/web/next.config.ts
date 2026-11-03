import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Vacío = same-origin (Vercel). Local dual Express: define NEXT_PUBLIC_API_URL en .env
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  },
};

export default nextConfig;
