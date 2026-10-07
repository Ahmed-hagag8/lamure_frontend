import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  // Last 7 days of orders
  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const orders = await db.order.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: 'asc' },
  })

  // Build a 7-day series
  const days: { date: string; label: string; total: number; count: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    days.push({
      date: d.toISOString().slice(0, 10),
      label,
      total: 0,
      count: 0,
    })
  }
  for (const o of orders) {
    const day = days.find((d) => d.date === o.createdAt.toISOString().slice(0, 10))
    if (day) {
      day.total += o.total
      day.count += 1
    }
  }

  // Sales by category — FIX N+1: Use aggregation with groupBy instead of loading ALL products + orderItems
  // Single query: join orderItems → products → categories and aggregate
  const salesByCategory = await db.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
  })

  // Batch-fetch only the products we need with their categories (single query with include)
  const productIds = salesByCategory.map((s) => s.productId)
  const products = productIds.length > 0
    ? await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: { select: { name: true } } },
      })
    : []

  // Build a lookup map for O(1) access instead of O(n) find per item
  const productMap = new Map(products.map((p) => [p.id, p.category.name]))

  const byCategory: Record<string, number> = {}
  for (const s of salesByCategory) {
    const categoryName = productMap.get(s.productId) ?? 'Unknown'
    byCategory[categoryName] = (byCategory[categoryName] ?? 0) + (s._sum.quantity ?? 0)
  }

  return NextResponse.json({
    days,
    byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
  })
}
