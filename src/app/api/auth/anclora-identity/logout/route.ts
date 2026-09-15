import { NextResponse } from 'next/server'
import { clearDataLabSession } from '@/lib/datalab-auth'
import { clearAncloraIdentityDataLabSession } from '@/lib/anclora-identity/session'

export async function POST(request: Request) {
  await clearAncloraIdentityDataLabSession()
  await clearDataLabSession()
  return NextResponse.redirect(new URL('/login', request.url))
}
