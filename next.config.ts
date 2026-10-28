import type { NextConfig } from "next";

/**
 * Static export: the site is plain HTML/CSS/JS in `out/`, so it runs on the
 * existing sainmotors.mn host (shared Apache hosting) without a Node process.
 * Trailing slashes make every route a folder with index.html, which any
 * static server resolves without rewrite rules.
 *
 * Not available in this mode (and not needed for V1): server redirects,
 * headers, rewrites, server actions, ISR, runtime image optimisation.
 * Redirects and headers live in public/.htaccess instead.
 */
const nextConfig: NextConfig = {
  // Optional fresh static-export destination for local verification.
  distDir: process.env.SAIN_EXPORT_DIR ?? ".next",
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
