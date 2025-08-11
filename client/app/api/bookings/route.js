import { NextResponse } from 'next/server'
import { mockDb } from '../_mock/db'

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

export async function GET(request) {
  const userId = getUserIdFromCookie(request)
  if (!userId) return NextResponse.json({ items: [] })

  const items = mockDb.bookingsByUser[userId] ?? []
  return NextResponse.json({ items })
}

export async function POST(request) {
  const userId = getUserIdFromCookie(request)
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { venueId, sport, courtId, date, startTime, durationHours, players, amount } = body

  const facility = mockDb.publicFacilities.find((f) => f.id === Number(venueId))
  if (!facility) return NextResponse.json({ message: 'Facility not found' }, { status: 404 })

  const bookingId = `QC${Date.now().toString().slice(-6)}`
  const courtName = (() => {
    const s = facility.sports.find((x) => x.name.toLowerCase() === String(sport).toLowerCase())
    const c = s?.courts.find((x) => x.id === courtId)
    return c?.name ?? courtId
  })()

  const endHour = String(Number.parseInt(startTime) + Number(durationHours)).padStart(2, '0') + ':00'
  const time = `${startTime} - ${endHour}`

  const normalized = {
    id: Date.now(),
    bookingId,
    venueId: facility.id,
    venueName: facility.name,
    venueImage: facility.images?.[0] ?? '/placeholder.svg',
    sportType: sport,
    courtId,
    courtName,
    date,
    time,
    status: 'Confirmed',
    amount: amount ?? 0,
    location: facility.location,
    players: players ?? 2,
    venuePhone: facility.phone,
    canCancel: true,
    canReschedule: true,
  }

  if (!mockDb.bookingsByUser[userId]) mockDb.bookingsByUser[userId] = []
  mockDb.bookingsByUser[userId].unshift(normalized)

  return NextResponse.json(normalized, { status: 201 })
}


