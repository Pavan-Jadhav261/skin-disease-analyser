import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

export const AUTH_COOKIE_NAME = 'skincheck_session'

type AuthTokenPayload = {
  username: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return new TextEncoder().encode(secret)
}

export async function signAuthToken(payload: AuthTokenPayload) {
  const secret = getJwtSecret()

  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyAuthToken(token: string) {
  const secret = getJwtSecret()
  const result = await jwtVerify(token, secret)

  return {
    username: String(result.payload.username ?? ''),
  }
}

export async function getAuthSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    return await verifyAuthToken(token)
  } catch {
    return null
  }
}
