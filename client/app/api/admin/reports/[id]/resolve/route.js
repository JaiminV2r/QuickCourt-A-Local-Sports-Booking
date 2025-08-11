import { NextResponse } from 'next/server'
import { mockDb } from '../../../../_mock/db'

export async function POST(request, { params }) {
  const id = Number(params.id)
  const report = mockDb.reports.find((r) => r.id === id)
  if (!report) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  report.status = 'resolved'
  return NextResponse.json({ success: true, id })
}


