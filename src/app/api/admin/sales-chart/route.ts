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

  // Sales by category
  const products = await db.product.findMany({ include: { category: true, orderItems: true } })
  const byCategory: Record<string, number> = {}
  for (const p of products) {
    const sold = p.orderItems.reduce((sum, oi) => sum + oi.quantity, 0)
    byCategory[p.category.name] = (byCategory[p.category.name] ?? 0) + sold
  }

  return NextResponse.json({
    days,
    byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
  })
}
