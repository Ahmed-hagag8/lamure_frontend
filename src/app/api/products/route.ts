import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseProductImages } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const limit = searchParams.get('limit')

  const where: any = { isActive: true }
  if (category && category !== 'all') {
    where.category = { slug: category }
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ]
  }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  if (sort === 'price-desc') orderBy = { price: 'desc' }
  if (sort === 'rating') orderBy = { rating: 'desc' }

  const products = await db.product.findMany({
    where,
    orderBy,
    take: limit ? parseInt(limit) : undefined,
    include: {
      category: true,
      supplier: true,
    },
  })

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      discount: p.discount,
      stock: p.stock,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: parseProductImages(p.images),
      size: p.size,
      color: p.color,
      brand: p.brand,
      isActive: p.isActive,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      categorySlug: p.category.slug,
      supplierId: p.supplierId,
      supplierName: p.supplier.name,
    }))
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, price, discount, stock, images, size, color, brand, categoryId, supplierId } = body

  if (!name || !description || !price || !categoryId || !supplierId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      stock: parseInt(stock || 0),
      images: JSON.stringify(images || []),
      size: size || null,
      color: color || null,
      brand: brand || null,
      categoryId,
      supplierId,
    },
    include: { category: true, supplier: true },
  })

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: parseProductImages(product.images),
    size: product.size,
    color: product.color,
    brand: product.brand,
    isActive: product.isActive,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    supplierId: product.supplierId,
    supplierName: product.supplier.name,
  })
}
