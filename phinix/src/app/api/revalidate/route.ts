import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

/**
 * POST /api/revalidate
 * Body: { secret: string, path?: string }
 *
 * On-demand ISR hook: call it from a CMS webhook (e.g. when a project is added)
 * and the affected pages are rebuilt instantly without a full deploy.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'revalidation_not_configured' }, { status: 501 })
  }

  let body: { secret?: string; path?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (body.secret !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const paths = body.path ? [body.path] : ['/hu', '/en', '/api/projects']
  for (const p of paths) revalidatePath(p)

  return NextResponse.json({ ok: true, revalidated: paths, at: new Date().toISOString() })
}
