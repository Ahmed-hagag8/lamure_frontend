import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  // Run all independent queries in parallel instead of sequentially
  const [
    userCount,
    productCount,
    orderCount,
    categoryCount,
    totalRevenueAgg,
    categoriesWithCounts,
    usersByRoleRaw,
    lowStock,
  ] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.order.count(),
    db.category.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    }),
    db.user.groupBy({
      by: ['role'],
      _count: true,
    }),
    db.product.findMany({
      where: { stock: { lte: 10 } },
      take: 5,
      orderBy: { stock: 'asc' },
      // Select only needed fields + use select for relations to avoid full model load
      select: {
        id: true,
        name: true,
        stock: true,
        category: { select: { name: true } },
        supplier: { select: { name: true } },
      },
    }),
  ])

  const totalRevenue = totalRevenueAgg._sum.total ?? 0

  const usersByRole = usersByRoleRaw.reduce((acc, r) => {
    acc[r.role] = r._count
    return acc
  }, {} as Record<string, number>)

  return NextResponse.json({
    totals: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      categories: categoryCount,
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
