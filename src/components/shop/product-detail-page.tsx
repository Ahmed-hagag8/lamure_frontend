'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useCart, useAuth, useUI, useWishlist } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice, type ProductDTO } from '@/lib/types'
import {
  Star, ShoppingCart, Heart, Share2, Truck, RefreshCw, ShieldCheck,
  Minus, Plus, ChevronRight, Check,
} from 'lucide-react'
import { toast } from 'sonner'

export function ProductDetailPage({ productId, initialProduct }: { productId: string; initialProduct?: ProductDTO }) {
  const { navigate } = useRouter()
  const { add } = useCart()
  const { role, user } = useAuth()
  const { setCartOpen } = useUI()

  const [product, setProduct] = React.useState<ProductDTO | null>(initialProduct ?? null)
  const [related, setRelated] = React.useState<ProductDTO[]>([])
  const [loading, setLoading] = React.useState(!initialProduct)
  const [activeImage, setActiveImage] = React.useState(0)
  const [qty, setQty] = React.useState(1)
  const wishlist = useWishlist()
  const isLiked = product ? wishlist.has(product.id) : false

  const [reviews, setReviews] = React.useState<any[]>([])
  const [reviewText, setReviewText] = React.useState('')
  const [reviewRating, setReviewRating] = React.useState(5)
  const [submittingReview, setSubmittingReview] = React.useState(false)

  React.useEffect(() => {
    if (initialProduct) {
      setActiveImage(0)
      setQty(1)
    }
  }, [initialProduct])

  React.useEffect(() => {
    if (initialProduct) return
    setLoading(true)
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((p) => { setProduct(p); setLoading(false) })
      .catch(() => setLoading(false))
  }, [productId, initialProduct])

  React.useEffect(() => {
    if (!product) return
    fetch(`/api/products?category=${product.categorySlug}&limit=5`)
      .then((r) => r.json())
      .then((items: ProductDTO[]) => setRelated(items.filter((p) => p.id !== product.id).slice(0, 4)))
      .catch(() => {})

    fetch(`/api/products/${product.id}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {})
  }, [product])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to leave a review')
      navigate({ name: 'login' })
      return
    }
    if (!reviewText.trim()) return
    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/products/${product!.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, rating: reviewRating, text: reviewText })
      })
      if (res.ok) {
        const newReview = await res.json()
        setReviews([newReview, ...reviews])
        setReviewText('')
        setReviewRating(5)
        toast.success('Review added successfully!')
      } else {
        toast.error('Failed to submit review')
      }
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const canBuy = role === 'CUSTOMER' || role === 'ADMIN'
  const finalPrice = discountedPrice(product.price, product.discount)
  const outOfStock = product.stock <= 0

  function handleAddToCart() {
    if (!canBuy) {
      toast.error('Sign in as a customer to add items to your cart.')
      navigate({ name: 'login' })
      return
    }
    add({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      discount: product!.discount,
      image: product!.images[0],
      quantity: qty,
      stock: product!.stock,
    })
    toast.success(`${product!.name} × ${qty} added to cart`)
    setCartOpen(true)
  }

  function handleBuyNow() {
    if (!canBuy) {
      toast.error('Sign in as a customer to buy.')
      navigate({ name: 'login' })
      return
    }
    add({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      discount: product!.discount,
      image: product!.images[0],
      quantity: qty,
      stock: product!.stock,
    })
    navigate({ name: 'checkout' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <button onClick={() => navigate({ name: 'home' })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button onClick={() => navigate({ name: 'shop', category: product.categorySlug })} className="hover:text-foreground capitalize">{product.categoryName}</button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square overflow-hidden rounded-2xl border bg-muted"
          >
            {product.images[activeImage] && (
              <Image src={product.images[activeImage]} alt={product.name} fill priority sizes="50vw" className="object-cover" />
            )}
            {product.discount > 0 && (
              <Badge variant="destructive" className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                -{product.discount}%
              </Badge>
            )}
          </motion.div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage ? 'border-primary' : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">{product.categoryName}</Badge>
              {product.brand && <Badge variant="outline" className="rounded-full">{product.brand}</Badge>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">· {product.reviewCount} reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
            {product.discount > 0 && (
              <Badge variant="destructive" className="rounded-full">Save {formatPrice(product.price - finalPrice)}</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            {product.size && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {/* Mocking multiple sizes based on the base size for UI purposes */}
                  {[product.size].map((s) => (      
                    <button
                      key={s}
                      className={`grid h-10 w-12 place-items-center rounded-lg border font-medium transition-all ${
                        s === product.size ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30' : 'hover:border-primary/50 bg-card hover:bg-accent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.color && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Color</p>
                <div className="flex flex-wrap gap-2">
                  <button className="grid h-10 w-full place-items-center rounded-lg border border-primary bg-primary/10 text-primary font-medium transition-all shadow-sm">
                    {product.color}
                  </button>
                </div>
              </div>
            )}
            <div className="col-span-2 flex gap-4 mt-2">
              <div className="flex-1 rounded-xl border bg-card/50 p-3 flex items-center gap-3 backdrop-blur-sm">
                <div className={`h-2.5 w-2.5 rounded-full ${outOfStock ? 'bg-destructive' : 'bg-emerald-500 animate-pulse'}`} />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Availability</p>
                  <p className={`text-sm font-semibold ${outOfStock ? 'text-destructive' : 'text-emerald-500'}`}>
                    {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
                  </p>
                </div>
              </div>
              <div className="flex-1 rounded-xl border bg-card/50 p-3 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground font-medium">Supplier</p>
                <p className="text-sm font-semibold truncate">{product.supplierName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quantity + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-lg border bg-card">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center hover:bg-accent rounded-l-lg"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="grid h-11 w-11 place-items-center hover:bg-accent rounded-r-lg"
                aria-label="Increase quantity"
                disabled={qty >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button size="lg" className="flex-1 min-w-[180px] gap-2 shadow-lg shadow-primary/20" onClick={handleAddToCart} disabled={outOfStock}>
              <ShoppingCart className="h-4 w-4" />
              {canBuy ? (outOfStock ? 'Out of stock' : 'Add to Cart') : 'Sign in to buy'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={handleBuyNow} disabled={outOfStock || !canBuy}>
              Buy Now
            </Button>

            <Button size="icon" variant="outline" className="h-11 w-11" onClick={() => {
              if (product) {
                wishlist.toggle({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  categorySlug: product.categorySlug
                })
                toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist')
              }
            }} aria-label="Wishlist">
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-chart-4 text-chart-4' : ''}`} />
            </Button>
            <Button size="icon" variant="outline" className="h-11 w-11" onClick={() => toast.success('Link copied to clipboard')} aria-label="Share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border bg-card p-4">
            {[
              { icon: Truck, title: 'Free shipping', desc: 'Orders > 500 EGP' },
              { icon: RefreshCw, title: '30-day returns', desc: 'Hassle-free' },
              { icon: ShieldCheck, title: '2-year warranty', desc: 'Quality assured' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1.5 text-xs font-semibold">{title}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 rounded-xl border bg-card p-6">
          <p className="leading-relaxed">{product.description}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {['Premium materials sourced sustainably', 'Designed for everyday comfort and durability', 'Backed by our quality assurance promise'].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6 rounded-xl border bg-card p-6">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium text-muted-foreground w-1/3">Brand</td>
                <td className="py-3">{product.brand ?? '—'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-muted-foreground">Category</td>
                <td className="py-3">{product.categoryName}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-muted-foreground">Size</td>
                <td className="py-3">{product.size ?? '—'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-muted-foreground">Color</td>
                <td className="py-3">{product.color ?? '—'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-muted-foreground">SKU</td>
                <td className="py-3 font-mono">{product.slug.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-muted-foreground">Supplier</td>
                <td className="py-3">{product.supplierName}</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6 rounded-xl border bg-card p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold">{product.rating.toFixed(1)}</div>
                <div className="mt-1 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{product.reviewCount} reviews</p>
              </div>

              {user ? (
                <form onSubmit={submitReview} className="space-y-4 rounded-xl border bg-muted/30 p-4">
                  <h4 className="font-semibold text-sm">Write a review</h4>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                        <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="What did you like or dislike?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <Button type="submit" disabled={submittingReview} className="w-full">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <div className="rounded-xl border bg-muted/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Sign in to share your thoughts.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate({ name: 'login' })} className="w-full">Sign In to Review</Button>
                </div>
              )}
            </div>

            <div className="md:w-2/3">
              <h3 className="font-semibold mb-4">Customer Reviews</h3>
              {reviews.length === 0 ? (
                <div className="text-center py-10 rounded-xl border border-dashed text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                  {reviews.map((r, i) => (
                    <div key={i} className="rounded-xl border p-4 bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCardMini key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { ProductCard } from '@/components/shop/product-card'
function ProductCardMini({ product, index }: { product: ProductDTO; index: number }) {
  return <ProductCard product={product} index={index} />
}
