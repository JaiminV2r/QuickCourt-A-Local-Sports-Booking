import { NextResponse } from 'next/server'
import { mockDb } from '../../../../_mock/db'

export async function GET(request, { params }) {
  const id = Number(params.id)
  const history = mockDb.userBookings[id] ?? []
  return NextResponse.json(history)
}


