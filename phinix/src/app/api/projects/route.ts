import { NextResponse } from 'next/server'
import { projects } from '@/data/projects'

export const dynamic = 'force-static'
export const revalidate = 3600

/**
 * GET /api/projects?locale=hu&category=Website
 *
 * Portfolio feed. Today it serves the curated list from src/data/projects.ts;
 * the shape is stable so it can later be backed by a CMS (Sanity, Strapi, …)
 * without touching the UI. Cached at the edge with ISR-style revalidation.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'hu'
  const category = searchParams.get('category')

  const items = projects.map((p) => ({
    slug: p.slug,
    client: p.client,
    title: p.title[locale],
    category: p.category[locale],
    year: p.year,
    result: p.result[locale],
    description: p.desc[locale],
    tags: p.tags,
    cover: p.cover,
    url: `/${locale}/#work`,
  }))

  const filtered = category ? items.filter((i) => i.category === category) : items

  return NextResponse.json(
    {
      locale,
      count: filtered.length,
      categories: [...new Set(items.map((i) => i.category))],
      items: filtered,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  )
}
