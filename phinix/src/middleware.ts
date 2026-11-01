import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|woff2?|ttf|otf|txt|xml|webmanifest|json|js|css|map)$/i

/**
 * Root-level locale negotiation.
 * `/` → `/hu` (default) or the best match from Accept-Language.
 * Everything else is served directly from the [locale] segment.
 * No cookie is set, so responses stay fully cacheable at the CDN.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/hu') ||
    pathname.startsWith('/en') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const header = req.headers.get('accept-language') ?? ''
  const prefersEnglish = /^en\b/i.test(header.trim()) && !/^hu\b/i.test(header.trim())
  const locale = prefersEnglish ? 'en' : 'hu'

  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  url.search = search

  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
