'use client'

import * as React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart, useUI, useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice } from '@/lib/types'
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI()
  const { lines, remove, setQuantity } = useCart()
  const { role } = useAuth()
  const { navigate } = useRouter()

  const subtotal = lines.reduce((sum, l) => sum + discountedPrice(l.price, l.discount) * l.quantity, 0)
  const savings = lines.reduce((sum, l) => sum + l.price * (l.discount / 100) * l.quantity, 0)

  function handleCheckout() {
    if (role !== 'CUSTOMER' && role !== 'ADMIN') {
      toast.error('Please sign in as a customer to checkout.')
      setCartOpen(false)
      return
    }
    if (lines.length === 0) return
    setCartOpen(false)
    navigate({ name: 'checkout' })
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
            {lines.length > 0 && (
              <Badge variant="secondary" className="rounded-full">{lines.length}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>{lines.length === 0 ? 'Your cart is empty.' : `${lines.length} item${lines.length > 1 ? 's' : ''} in your cart.`}</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Browse our catalog and add items you love.</p>
            </div>
            <Button onClick={() => { setCartOpen(false); navigate({ name: 'shop' }) }}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {lines.map((l) => {
                  const unitPrice = discountedPrice(l.price, l.discount)
                  return (
                    <li key={l.productId} className="flex gap-3 rounded-xl border bg-card p-3 animate-scale-in">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted shrink-0">
                        <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-medium">{l.name}</p>
                          <button onClick={() => remove(l.productId)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">{formatPrice(unitPrice)}</span>
                          {l.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through">{formatPrice(l.price)}</span>
                          )}
                        </div>
                        <div className="mt-auto flex items-center gap-2 pt-2">
                          <div className="inline-flex items-center rounded-lg border bg-background">
                            <button
                              onClick={() => setQuantity(l.productId, l.quantity - 1)}
                              className="grid h-7 w-7 place-items-center hover:bg-accent rounded-l-lg"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-medium">{l.quantity}</span>
                            <button
                              onClick={() => setQuantity(l.productId, l.quantity + 1)}
                              className="grid h-7 w-7 place-items-center hover:bg-accent rounded-r-lg"
                              aria-label="Increase"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-xs text-muted-foreground">of {l.stock} in stock</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <SheetFooter className="border-t p-5">
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
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="mt-3 w-full gap-2 group">
                {role === 'GUEST' || role === 'SUPPLIER' ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign in to Checkout
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
