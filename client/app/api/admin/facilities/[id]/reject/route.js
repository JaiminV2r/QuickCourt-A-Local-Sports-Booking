import { NextResponse } from 'next/server'
import { mockDb } from '../../../../_mock/db'

export async function PUT(request, { params }) {
  const id = Number(params.id)
  const body = await request.json().catch(() => ({}))
  const idx = mockDb.facilities.pending.findIndex((f) => f.id === id)
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  const facility = mockDb.facilities.pending.splice(idx, 1)[0]
  mockDb.facilities.rejected.push({ ...facility, rejectedDate: new Date().toISOString().slice(0, 10), rejectionReason: body?.reason ?? 'Not specified' })
  return NextResponse.json({ success: true, id, reason: body?.reason ?? null })
}


