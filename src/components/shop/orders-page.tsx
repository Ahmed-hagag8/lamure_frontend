'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice } from '@/lib/types'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'

interface OrderDTO {
  id: string
  total: number
  status: string
  paymentMethod: string
  address: string
  createdAt: string
  items: { id: string; quantity: number; price: number; product: { id: string; name: string; images: string } }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-chart-3/15 text-chart-3',
  PAID: 'bg-chart-2/15 text-chart-2',
  SHIPPED: 'bg-primary/15 text-primary',
  DELIVERED: 'bg-primary/15 text-primary',
  CANCELLED: 'bg-destructive/15 text-destructive',
}

export function OrdersPage() {
  const { user, hasHydrated } = useAuth()
  const { navigate } = useRouter()
  const [orders, setOrders] = React.useState<OrderDTO[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!hasHydrated) return
    if (!user) {
      navigate({ name: 'login' })
      return
    }
    fetch(`/api/orders?userId=${user.id}&role=CUSTOMER`)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user, navigate, hasHydrated])

  if (!hasHydrated || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
      <p className="mt-1 text-muted-foreground">Track and review your past purchases.</p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
          <p className="text-sm text-muted-foreground">When you place your first order, it will appear here.</p>
          <Button className="mt-4 gap-2" onClick={() => navigate({ name: 'shop' })}>
            <ShoppingBag className="h-4 w-4" /> Start Shopping
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o, idx) => {
            const date = new Date(o.createdAt)
            const itemCount = o.items.reduce((s, i) => s + i.quantity, 0)
            return (
              <Card key={o.id} className="overflow-hidden animate-fade-in-up" >
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Order #{o.id.slice(0, 8).toUpperCase()}</h3>
                        <Badge variant="secondary" className={`rounded-full ${STATUS_COLORS[o.status] ?? ''}`}>
                          {o.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Placed on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatPrice(o.total)}</p>
                      <p className="text-xs text-muted-foreground">{itemCount} item{itemCount > 1 ? 's' : ''} · {o.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {o.items.map((it) => {
                      const images = (() => { try { return JSON.parse(it.product.images) } catch { return [] } })() as string[]
                      return (
                        <div key={it.id} className="flex gap-3 rounded-lg border bg-card p-2">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                            {images[0] && <Image src={images[0]} alt={it.product.name} fill sizes="64px" className="object-cover" />}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <p className="line-clamp-2 text-sm font-medium">{it.product.name}</p>
                            <p className="mt-auto text-xs text-muted-foreground">Qty {it.quantity} × {formatPrice(it.price)}</p>
                          </div>
                          <button
                            onClick={() => navigate({ name: 'product', id: it.product.id })}
                            className="self-center text-muted-foreground hover:text-primary"
                            aria-label="View product"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {o.address && (
                    <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                      Shipping to: <span className="text-foreground">{o.address}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
