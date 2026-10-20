import { NextResponse } from 'next/server';
import type { HealthResponse } from '@dehradun/contracts';

export const dynamic = 'force-static';

const startTime = Date.now();

/**
 * GET /api/health
 * Returns the health status of the Next.js web application.
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'web',
    version: process.env.npm_package_version ?? '0.1.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  return NextResponse.json(response);
}
