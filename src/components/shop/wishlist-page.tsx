'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWishlist, useCart, useAuth, useUI } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice } from '@/lib/types'
import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function WishlistPage() {
  const { items, toggle } = useWishlist()
  const { add } = useCart()
  const { role } = useAuth()
  const { navigate } = useRouter()
  const { setCartOpen } = useUI()

  const canBuy = role === 'CUSTOMER' || role === 'ADMIN'

  function handleAddToCart(item: any) {
    if (!canBuy) {
      toast.error('Sign in as a customer to add items to your cart.')
      navigate({ name: 'login' })
      return
    }
    add({
      productId: item.productId,
      name: item.name,
      price: item.price,
      discount: 0,
      image: item.image,
      quantity: 1,
      stock: 99, // default to 99 since we don't store stock in wishlist
    })
    toast.success(`${item.name} added to cart`)
    setCartOpen(true)
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-muted text-muted-foreground mb-6">
          <Heart className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You haven't saved any items to your wishlist yet. Start shopping and add your favorite items to save them for later.
        </p>
        <Button size="lg" onClick={() => navigate({ name: 'shop' })} className="gap-2">
          Explore Products <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group relative overflow-hidden flex flex-col h-full border-border/60 hover-lift">
              <div 
                className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
                onClick={() => navigate({ name: 'product', id: item.productId })}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">No image</div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(item)
                    toast.success('Removed from wishlist')
                  }}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  {item.categorySlug}
                </span>
                <h3 
                  className="font-semibold line-clamp-2 cursor-pointer hover:text-primary transition-colors flex-1"
                  onClick={() => navigate({ name: 'product', id: item.productId })}
                >
                  {item.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                  <Button size="sm" variant="secondary" onClick={() => handleAddToCart(item)} className="h-8 shadow-sm">
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
