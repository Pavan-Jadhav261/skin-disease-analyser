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

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const secret = getSecret()

  if (!token || !secret) {
    return false
  }

  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = await hasValidSession(request)

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/detect/:path*', '/login'],
}

