import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

import { AUTH_COOKIE_NAME } from '@/lib/auth'

function getSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return null
  }

  return new TextEncoder().encode(secret)
}

async function getSessionUsername(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const secret = getSecret()

  if (!token || !secret) {
    return null
  }

  try {
    const result = await jwtVerify(token, secret)
    return typeof result.payload.username === 'string' ? result.payload.username : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const username = await getSessionUsername(request)
  const authenticated = Boolean(username)

  if (pathname.startsWith('/detect') && !authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', '/detect')
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/login') && authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/detect'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/register') && authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/detect'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin')) {
    if (!authenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', '/admin')
      return NextResponse.redirect(url)
    }

    if (username !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/detect'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/detect/:path*', '/login', '/register', '/admin', '/admin/:path*'],
}
