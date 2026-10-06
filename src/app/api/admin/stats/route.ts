import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [users, products, orders, categories] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.order.count(),
    db.category.count(),
  ])

  const totalRevenueAgg = await db.order.aggregate({ _sum: { total: true } })
  const totalRevenue = totalRevenueAgg._sum.total ?? 0

  // Per-category product counts
  const categoriesWithCounts = await db.category.findMany({
    include: { _count: { select: { products: true } } },
  })

  // Per-role user counts
  const usersByRoleRaw = await db.user.groupBy({
    by: ['role'],
    _count: true,
  })
  const usersByRole = usersByRoleRaw.reduce((acc, r) => {
    acc[r.role] = r._count
    return acc
  }, {} as Record<string, number>)

  // Low-stock products (<=10)
  const lowStock = await db.product.findMany({
    where: { stock: { lte: 10 } },
    take: 5,
    orderBy: { stock: 'asc' },
    include: { category: true, supplier: true },
  })

  return NextResponse.json({
    totals: {
      users,
      products,
      orders,
      categories,
      revenue: totalRevenue,
    },
    categories: categoriesWithCounts.map((c) => ({
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    })),
    usersByRole,
    lowStock: lowStock.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      category: p.category.name,
      supplier: p.supplier.name,
    })),
  })
}
