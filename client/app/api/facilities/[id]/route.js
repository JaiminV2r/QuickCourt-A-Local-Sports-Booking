import { NextResponse } from 'next/server'
import { mockDb } from '../../_mock/db'

export async function GET(_request, { params }) {
  const id = Number(params.id)
  const facility = mockDb.publicFacilities.find((f) => f.id === id)
  if (!facility) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(facility)
}


