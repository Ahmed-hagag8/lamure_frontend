import { type ProductDTO, type CategoryDTO } from '@/lib/types'
import { RouterProvider } from '@/lib/router'
import { AppShell } from '@/components/layout/app-shell'

async function getInitialData() {
  const [productsRes, categoriesRes] = await Promise.all([
    fetch('http://127.0.0.1:8000/api/products?limit=100', { cache: 'no-store' }),
    fetch('http://127.0.0.1:8000/api/categories', { cache: 'no-store' }),
  ])
  
  if (!productsRes.ok || !categoriesRes.ok) {
    return { products: [], categories: [] }
  }

  const products = await productsRes.json()
  const categories = await categoriesRes.json()

  return {
    products: products as ProductDTO[],
    categories: categories as CategoryDTO[],
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
