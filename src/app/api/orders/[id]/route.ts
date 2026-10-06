import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { status } = body
  if (!status) return NextResponse.json({ error: 'Status required' }, { status: 400 })

  const order = await db.order.update({
    where: { id },
    data: { status },
  })
  return NextResponse.json(order)
}
