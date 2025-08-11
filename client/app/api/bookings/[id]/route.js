import { NextResponse } from 'next/server'
import { mockDb } from '../../_mock/db'

function getUserIdFromCookie(request) {
  const cookie = request.cookies.get('quickcourt_user')?.value
  if (!cookie) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(cookie))
    return parsed.id || null
  } catch {
    return null
  }
}

export async function GET(request, { params }) {
  const userId = getUserIdFromCookie(request)
  const list = userId ? mockDb.bookingsByUser[userId] ?? [] : []
  const item = list.find((b) => String(b.id) === String(params.id) || String(b.bookingId) === String(params.id))
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function DELETE(request, { params }) {
  const userId = getUserIdFromCookie(request)
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const list = mockDb.bookingsByUser[userId] ?? []
  const idx = list.findIndex((b) => String(b.id) === String(params.id) || String(b.bookingId) === String(params.id))
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  const booking = list[idx]
  booking.status = 'Cancelled'
  booking.canCancel = false
  mockDb.bookingsByUser[userId][idx] = booking
  return NextResponse.json(booking)
}


