import { NextResponse } from 'next/server'
import { mockDb } from '../../_mock/db'

export async function GET() {
  return NextResponse.json(mockDb.adminProfile)
}

export async function PUT(request) {
  const body = await request.json().catch(() => ({}))
  mockDb.adminProfile = { ...mockDb.adminProfile, ...body }
  return NextResponse.json(mockDb.adminProfile)
}


