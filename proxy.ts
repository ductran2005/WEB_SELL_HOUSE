import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['vi', 'en']
const defaultLocale = 'vi'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  const parsedLanguages = acceptLanguage
    .toLowerCase()
    .split(',')
    .map((lang) => {
      const parts = lang.split(';')
      return parts[0].trim()
    })

  for (const lang of parsedLanguages) {
    if (lang.startsWith('vi')) {
      return 'vi'
    }
    if (lang.startsWith('en')) {
      return 'en'
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Exclude API routes, static assets, images, and standard config files
    '/((?!api|_next/static|_next/image|image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
