import { db } from '@/lib/db'
import { parseProductImages, type ProductDTO, type CategoryDTO } from '@/lib/types'
import { RouterProvider } from '@/lib/router'
import { AppShell } from '@/components/layout/app-shell'

async function getInitialData() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { category: true, supplier: true },
    }),
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return {
    products: products.map((p) => ({
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
    })) as ProductDTO[],
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      productCount: c._count.products,
    })) as CategoryDTO[],
  }
}

export default async function Home() {
  const { products, categories } = await getInitialData()

  return (
    <RouterProvider>
      <AppShell initialProducts={products} categories={categories} />
    </RouterProvider>
  )
}
