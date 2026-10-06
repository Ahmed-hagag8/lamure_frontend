export type Role = 'GUEST' | 'CUSTOMER' | 'ADMIN' | 'SUPPLIER'

export interface ProductDTO {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount: number
  stock: number
  rating: number
  reviewCount: number
  images: string[]
  size?: string | null
  color?: string | null
  brand?: string | null
  isActive: boolean
  categoryId: string
  categoryName: string
  categorySlug: string
  supplierId: string
  supplierName: string
}

export interface CategoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  productCount: number
}

export function parseProductImages(images: string): string[] {
  try {
    const arr = JSON.parse(images)
    if (Array.isArray(arr)) return arr as string[]
    return []
  } catch {
    return []
  }
}

export function discountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function canBuy(role: Role): boolean {
  return role === 'CUSTOMER' || role === 'ADMIN'
}

export function canEditProducts(role: Role): boolean {
  return role === 'SUPPLIER' || role === 'ADMIN'
}

export function canAccessAdmin(role: Role): boolean {
  return role === 'ADMIN'
}
