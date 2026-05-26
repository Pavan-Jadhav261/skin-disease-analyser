import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, signAuthToken } from '@/lib/auth'
import { registerUser } from '@/lib/user-store'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const username = typeof body?.username === 'string' ? body.username : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    const result = await registerUser(username, password)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 },
      )
    }

    const token = await signAuthToken({ username: result.user.username })
    const response = NextResponse.json({
      success: true,
      username: result.user.username,
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
    console.error('Register error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to register right now.',
      },
      { status: 500 },
    )
  }
}

