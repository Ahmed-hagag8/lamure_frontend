'use client'

import * as React from 'react'
import { ProductCard } from '@/components/shop/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from '@/lib/router'
import type { ProductDTO } from '@/lib/types'
import { Search, SlidersHorizontal, X, PackageOpen, Shirt, Smartphone, Footprints, LayoutGrid } from 'lucide-react'

interface ShopPageProps {
  initialProducts: ProductDTO[]
  categories: { id: string; name: string; slug: string; productCount: number }[]
  initialCategory?: string
  initialSearch?: string
}

const CATEGORY_ICONS: Record<string, any> = {
  clothing: Shirt,
  electronics: Smartphone,
  shoes: Footprints,
}

export function ShopPage({ initialProducts, categories, initialCategory, initialSearch }: ShopPageProps) {
  const { navigate } = useRouter()
  const [products, setProducts] = React.useState<ProductDTO[]>(initialProducts)
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState(initialSearch ?? '')
  const [category, setCategory] = React.useState<string>(initialCategory ?? 'all')
  const [sort, setSort] = React.useState('newest')
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 5000])
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter+sort locally for responsiveness
  const filtered = React.useMemo(() => {
    let list = [...products]
    if (category !== 'all') {
      list = list.filter((p) => p.categorySlug === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q)
      )
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, category, search, sort, priceRange])

  // Sync URL when category changes (UX nicety)
  React.useEffect(() => {
    if (category !== (initialCategory ?? 'all')) {
      navigate({ name: 'shop', category: category !== 'all' ? category : undefined, search: search || undefined })
    }
  }, [category])

  function clearFilters() {
    setCategory('all')
    setSearch('')
    setPriceRange([0, 5000])
    setSort('newest')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="mt-1 text-muted-foreground">Browse our {products.length} products across {categories.length} categories.</p>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            category === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          All
        </button>
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c.slug] ?? PackageOpen
          const active = category === c.slug
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {c.name}
              <span className={`text-[10px] ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>({c.productCount})</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-24 space-y-5 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="h-9 pl-8"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Price range</label>
                <span className="text-xs font-medium">{priceRange[0]} – {priceRange[1]} EGP</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={5000}
                step={50}
                className="mt-2"
              />
            </div>

            {/* Sort */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort by</label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="lg:hidden w-full" onClick={() => setShowFilters(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        </aside>

        {/* Products grid */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of {products.length} products
            </p>
            <Button variant="outline" size="sm" className="lg:hidden gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <PackageOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
