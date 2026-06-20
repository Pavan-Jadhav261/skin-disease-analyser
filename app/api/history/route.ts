import { NextResponse } from 'next/server'

import { getAuthSession } from '@/lib/auth'
import { getUserActivity } from '@/lib/local-store'

export async function GET() {
  const session = await getAuthSession()

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const history = await getUserActivity(session.username)

  return NextResponse.json({
    success: true,
    history,
  })
}

