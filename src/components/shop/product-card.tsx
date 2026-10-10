'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/lib/router'
import { useCart, useAuth, useUI, useWishlist } from '@/lib/store'
import { formatPrice, discountedPrice, type ProductDTO } from '@/lib/types'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: ProductDTO
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { navigate } = useRouter()
  const { add } = useCart()
  const { role } = useAuth()
  const { setCartOpen, setAuthDialogOpen: _ } = useUI()
  const wishlist = useWishlist()
  const isLiked = wishlist.has(product.id)
  const canBuy = role === 'CUSTOMER' || role === 'ADMIN'

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (!canBuy) {
      toast.error('Sign in as a customer to add items to your cart.')
      navigate({ name: 'login' })
      return
    }
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.images[0],
      quantity: 1,
      stock: product.stock,
    })
    toast.success(`${product.name} added to cart`)
    setCartOpen(true)
  }

  const finalPrice = discountedPrice(product.price, product.discount)
  const outOfStock = product.stock <= 0

  return (
    <Card
      onClick={() => navigate({ name: 'product', id: product.id })}
      className="group relative cursor-pointer overflow-hidden border-border/60 p-0 hover-lift animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">No image</div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <Badge variant="destructive" className="rounded-full px-2 py-1 text-[10px] font-bold shadow">
              -{product.discount}%
            </Badge>
          )}
          {outOfStock && (
            <Badge variant="secondary" className="rounded-full px-2 py-1 text-[10px]">Out of stock</Badge>
          )}
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            wishlist.toggle({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              categorySlug: product.categorySlug
            })
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-chart-4 transition-colors z-10"
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-chart-4 text-chart-4' : ''}`} />
        </button>

        {/* Hover overlay actions */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transform p-3 transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={outOfStock}
              className="flex-1 gap-1.5 shadow-lg"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {canBuy ? 'Add to Cart' : 'Sign in'}
            </Button>
            <Button size="icon" variant="secondary" className="shrink-0 shadow-lg" aria-label="Quick view">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground/60">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-[11px] text-muted-foreground">{product.brand}</p>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-primary">{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
