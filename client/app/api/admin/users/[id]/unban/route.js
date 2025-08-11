import { NextResponse } from 'next/server'
import { mockDb } from '../../../../_mock/db'

export async function POST(request, { params }) {
  const id = Number(params.id)
  const user = mockDb.users.find((u) => u.id === id)
  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  user.status = 'active'
  return NextResponse.json({ success: true, id })
}


