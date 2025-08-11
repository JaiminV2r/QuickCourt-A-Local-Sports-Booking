import { NextResponse } from 'next/server'
import { mockDb } from '../../../_mock/db'

export async function GET() {
  return NextResponse.json(mockDb.facilities.rejected)
}


