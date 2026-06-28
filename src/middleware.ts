import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // ── Admin login page: redirect away if already authenticated as admin ──
  if (pathname === '/admin/login') {
    if (token && token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // ── Protect all /admin/* routes ──
  if (pathname.startsWith('/admin')) {
    // Not logged in → send to admin login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Logged in but NOT admin → send to homepage (not login)
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ── Protect /account routes — require any logged-in user ──
  if (pathname.startsWith('/account')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
