import { NextResponse } from 'next/server'
import { mockDb } from '../../_mock/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  let users = mockDb.users
  if (role) users = users.filter((u) => u.role === role)
  if (status) users = users.filter((u) => u.status === status)
  return NextResponse.json(users)
}


