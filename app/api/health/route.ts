import { NextResponse } from "next/server";

/**
 * Health check endpoint used by:
 *  - Docker's HEALTHCHECK instruction (docker/Dockerfile)
 *  - Kubernetes liveness & readiness probes (k8s/deployment.yaml)
 *  - Uptime monitors / load balancer health checks
 *
 * Kept intentionally dependency-free so it can respond even if something
 * downstream (e.g. a future database or external API) is degraded — this
 * route only proves the Node.js process itself is alive and serving.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
