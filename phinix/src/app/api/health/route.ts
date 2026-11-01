import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** GET /api/health — lightweight liveness probe for uptime monitors. */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'phinix-web',
      version: process.env.npm_package_version ?? '1.0.0',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
