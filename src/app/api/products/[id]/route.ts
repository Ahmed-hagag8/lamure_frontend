import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseProductImages } from '@/lib/types'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, supplier: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const data: any = {}
  if (body.name !== undefined) data.name = body.name
  if (body.description !== undefined) data.description = body.description
  if (body.price !== undefined) data.price = parseFloat(body.price)
  if (body.discount !== undefined) data.discount = parseFloat(body.discount)
  if (body.stock !== undefined) data.stock = parseInt(body.stock)
  if (body.images !== undefined) data.images = JSON.stringify(body.images)
  if (body.size !== undefined) data.size = body.size || null
  if (body.color !== undefined) data.color = body.color || null
  if (body.brand !== undefined) data.brand = body.brand || null
  if (body.isActive !== undefined) data.isActive = body.isActive
  if (body.categoryId !== undefined) data.categoryId = body.categoryId

  const product = await db.product.update({
    where: { id },
    data,
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
