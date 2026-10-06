import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, items, address, paymentMethod } = body

  if (!userId || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify stock and compute total
  const productIds = items.map((i: any) => i.productId)
  const products = await db.product.findMany({ where: { id: { in: productIds } } })

  let total = 0
  const orderItems: any[] = []
  for (const item of items) {
    const p = products.find((pp) => pp.id === item.productId)
    if (!p) continue
    const unitPrice = p.price * (1 - p.discount / 100)
    total += unitPrice * item.quantity
    orderItems.push({
      productId: p.id,
      quantity: item.quantity,
      price: unitPrice,
    })
  }

  const order = await db.order.create({
    data: {
      userId,
      total,
      status: 'PAID',
      paymentMethod: paymentMethod || 'CARD',
      address,
      items: { create: orderItems },
    },
    include: { items: { include: { product: true } } },
  })

  // Decrement stock
  for (const item of items) {
    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })
  }

  return NextResponse.json(order)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const role = searchParams.get('role')

  let where: any = {}
  if (role === 'CUSTOMER' && userId) {
    where.userId = userId
  }

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: { include: { product: true } },
    },
    take: 100,
  })

  return NextResponse.json(orders)
}
