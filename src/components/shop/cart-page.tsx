'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart, useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice } from '@/lib/types'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react'
import { toast } from 'sonner'

export function CartPage() {
  const { lines, remove, setQuantity, clear } = useCart()
  const { role } = useAuth()
  const { navigate } = useRouter()

  const subtotal = lines.reduce((sum, l) => sum + discountedPrice(l.price, l.discount) * l.quantity, 0)
  const savings = lines.reduce((sum, l) => sum + l.price * (l.discount / 100) * l.quantity, 0)
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50
  const tax = subtotal * 0.14
  const total = subtotal + shipping + tax
  const canCheckout = (role === 'CUSTOMER' || role === 'ADMIN') && lines.length > 0

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven\'t added anything yet.</p>
          <Button className="mt-6 gap-2" onClick={() => navigate({ name: 'shop' })}>
            Browse products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <button onClick={() => navigate({ name: 'shop' })} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </button>

      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <p className="mt-1 text-muted-foreground">{lines.length} item{lines.length > 1 ? 's' : ''} in your cart.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {lines.map((l) => {
            const unitPrice = discountedPrice(l.price, l.discount)
            return (
              <Card key={l.productId} className="overflow-hidden">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium leading-snug">{l.name}</h3>
                        <p className="text-xs text-muted-foreground">In stock: {l.stock}</p>
                      </div>
                      <button onClick={() => { remove(l.productId); toast.success('Removed') }} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {l.discount > 0 && (
                        <Badge variant="destructive" className="rounded-full text-[10px]">-{l.discount}%</Badge>
                      )}
                      <span className="font-semibold text-primary">{formatPrice(unitPrice)}</span>
                      {l.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(l.price)}</span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-lg border bg-background">
                        <button onClick={() => setQuantity(l.productId, l.quantity - 1)} className="grid h-8 w-8 place-items-center hover:bg-accent rounded-l-lg" aria-label="Decrease">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{l.quantity}</span>
                        <button onClick={() => setQuantity(l.productId, l.quantity + 1)} className="grid h-8 w-8 place-items-center hover:bg-accent rounded-r-lg" aria-label="Increase">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(unitPrice * l.quantity)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <Button variant="ghost" size="sm" onClick={() => { clear(); toast.success('Cart cleared') }} className="gap-2 text-muted-foreground">
            <Trash2 className="h-4 w-4" /> Clear cart
          </Button>
        </div>

        {/* Summary */}
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-primary">
                  <span>You save</span>
                  <span>−{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (14%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full gap-2 shadow-lg shadow-primary/20" disabled={!canCheckout} onClick={() => navigate({ name: 'checkout' })}>
              {canCheckout ? (
                <>Proceed to Checkout <ArrowRight className="h-4 w-4" /></>
              ) : (
                <><Lock className="h-4 w-4" /> Sign in to checkout</>
              )}
            </Button>

            {!canCheckout && (
              <p className="text-center text-xs text-muted-foreground">
                <button onClick={() => navigate({ name: 'login' })} className="text-primary hover:underline font-medium">Sign in</button> as a customer to complete your purchase.
              </p>
            )}

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Have a promo code?</p>
              <div className="flex gap-2">
                <Input placeholder="Enter code" className="bg-background" />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
