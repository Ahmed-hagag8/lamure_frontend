import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, items, address, paymentMethod } = body

  if (!userId || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify stock and compute total — single batch query instead of N queries
  const productIds = items.map((i: any) => i.productId)
  const products = await db.product.findMany({ where: { id: { in: productIds } } })

  // Use a Map for O(1) lookup instead of O(n) find per item
  const productMap = new Map(products.map((p) => [p.id, p]))

  let total = 0
  const orderItems: any[] = []
  for (const item of items) {
    const p = productMap.get(item.productId)
    if (!p) continue
    if (p.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for "${p.name}". Available: ${p.stock}` },
        { status: 400 }
      )
    }
    const unitPrice = p.price * (1 - p.discount / 100)
    total += unitPrice * item.quantity
    orderItems.push({
      productId: p.id,
      quantity: item.quantity,
      price: unitPrice,
    })
  }

  // Use a transaction to ensure atomicity of order creation + stock decrement
  // This prevents race conditions and ensures consistency
  const order = await db.$transaction(async (tx) => {
    // Create order with items in one query
    const newOrder = await tx.order.create({
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

    // Batch stock decrement using Promise.all instead of sequential awaits
    // This runs all updates concurrently within the transaction
    await Promise.all(
      items.map((item: any) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    )

    return newOrder
  })

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
      user: {
        // Select only needed fields instead of entire user object
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: {
            // Select only needed fields instead of entire product
            select: { id: true, name: true, images: true, price: true },
          },
        },
      },
    },
    take: 100,
  })

  return NextResponse.json(orders)
}
