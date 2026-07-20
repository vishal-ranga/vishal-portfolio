import type { NextConfig } from "next";

/**
 * Next.js production configuration.
 *
 * - `output: "standalone"` produces a minimal, self-contained server bundle
 *   (server.js + only the node_modules actually used), which is what makes
 *   the multi-stage Docker build small and fast to deploy.
 * - Security headers are applied globally so they show up on every route.
 */
const nextConfig: NextConfig = {
  output: "standalone",

  // Next.js 16's dev server blocks cross-origin requests to its own dev
  // assets (JS/CSS/HMR) by default, as a DNS-rebinding protection. That
  // means opening the site via a LAN/VM-network IP (e.g. VirtualBox's
  // host-only adapter) instead of localhost shows a blank page with a
  // "Blocked cross-origin request to Next.js dev resource" warning in
  // the terminal. This only affects `next dev` — it has no effect on
  // `next build`/`next start` or the production Docker image.
  //
  // Add every IP/hostname you actually open the dev server from here.
  ...(process.env.NODE_ENV !== "production" && {
    allowedDevOrigins: ["192.168.56.1"],
  }),

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
