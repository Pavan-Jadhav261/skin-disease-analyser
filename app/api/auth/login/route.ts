import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, signAuthToken } from '@/lib/auth'
import { authenticateUser } from '@/lib/user-store'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const username = typeof body?.username === 'string' ? body.username : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    const user = await authenticateUser(username, password)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username or password.',
        },
        { status: 401 },
      )
    }

    const token = await signAuthToken({ username: user.username })
    const response = NextResponse.json({
      success: true,
      username: user.username,
    })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to sign in right now.',
      },
      { status: 500 },
    )
  }
}
