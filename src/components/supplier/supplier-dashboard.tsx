'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Package, Plus, Pencil, Trash2, DollarSign, TrendingUp, Boxes, Star,
} from 'lucide-react'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice, type ProductDTO } from '@/lib/types'
import { toast } from 'sonner'

interface CategoryDTO { id: string; name: string; slug: string }

export function SupplierDashboard() {
  const { user, role, hasHydrated } = useAuth()
  const { navigate } = useRouter()

  const [products, setProducts] = React.useState<ProductDTO[]>([])
  const [categories, setCategories] = React.useState<CategoryDTO[]>([])
  const [editing, setEditing] = React.useState<ProductDTO | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (!hasHydrated) return
    if (role !== 'SUPPLIER' || !user) {
      navigate({ name: 'home' })
      return
    }
    Promise.all([
      fetch('/api/products?limit=100').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([ps, cs]: [ProductDTO[], CategoryDTO[]]) => {
      setProducts(ps.filter((p) => p.supplierId === user.id))
      setCategories(cs)
    })
  }, [role, user, navigate, hasHydrated])

  if (!hasHydrated || role !== 'SUPPLIER' || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading dashboard…</p>
      </div>
    )
  }

  const myActive = products.filter((p) => p.isActive).length
  const totalStock = products.reduce((s, p) => s + p.stock, 0)
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const avgRating = products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0

  const stats_cards = [
    { label: 'My Products', value: products.length.toString(), icon: Package, color: 'from-emerald-500 to-teal-500' },
    { label: 'Active listings', value: myActive.toString(), icon: Boxes, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total stock', value: totalStock.toString(), icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Inventory value', value: formatPrice(totalValue), icon: DollarSign, color: 'from-purple-500 to-pink-500' },
  ]

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(p: ProductDTO) {
    setEditing(p)
    setDialogOpen(true)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Supplier Dashboard
            <Badge variant="secondary" className="gap-1">
              <Package className="h-3 w-3" /> {user.name}
            </Badge>
          </h1>
          <p className="mt-1 text-muted-foreground">Manage your product catalog, prices, and stock.</p>
        </div>
        <Button onClick={openNew} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="hover-lift animate-fade-in-up">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Rating summary */}
      <Card className="mt-6 overflow-hidden">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-chart-4 to-chart-5 text-white shadow-lg">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{avgRating.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">/ 5.00</span>
              </div>
              <p className="text-xs text-muted-foreground">Average rating across all your products</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{products.reduce((s, p) => s + p.reviewCount, 0)}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> My products</CardTitle>
          <CardDescription>Edit details, adjust stock, or remove items.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
              <p className="text-sm text-muted-foreground">Add your first product to start selling.</p>
              <Button className="mt-4 gap-2" onClick={openNew}>
                <Plus className="h-4 w-4" /> Add product
              </Button>
            </div>
          ) : (
            <div className="max-h-[28rem] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand || '—'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{p.categoryName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {p.discount > 0 && (
                            <Badge variant="destructive" className="rounded-full text-[10px]">-{p.discount}%</Badge>
                          )}
                          <span className="font-medium">{formatPrice(discountedPrice(p.price, p.discount))}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.stock <= 5 ? 'destructive' : p.stock <= 10 ? 'secondary' : 'outline'} className="rounded-full">
                          {p.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                          {p.rating.toFixed(1)}
                          <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.isActive ? 'default' : 'secondary'} className="rounded-full">
                          {p.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        categories={categories}
        supplierId={user.id}
        onSaved={(p, isNew) => {
          if (isNew) {
            setProducts((prev) => [p, ...prev])
          } else {
            setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)))
          }
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

function ProductEditDialog({
  open, onOpenChange, product, categories, supplierId, onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: ProductDTO | null
  categories: CategoryDTO[]
  supplierId: string
  onSaved: (p: ProductDTO, isNew: boolean) => void
}) {
  const isNew = !product
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [discount, setDiscount] = React.useState('0')
  const [stock, setStock] = React.useState('')
  const [brand, setBrand] = React.useState('')
  const [size, setSize] = React.useState('')
  const [color, setColor] = React.useState('')
  const [categoryId, setCategoryId] = React.useState('')
  const [images, setImages] = React.useState<string[]>([])
  const [imageInput, setImageInput] = React.useState('')
  const [isActive, setIsActive] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setPrice(String(product.price))
      setDiscount(String(product.discount))
      setStock(String(product.stock))
      setBrand(product.brand ?? '')
      setSize(product.size ?? '')
      setColor(product.color ?? '')
      setCategoryId(product.categoryId)
      setImages(product.images)
      setIsActive(product.isActive)
    } else {
      setName(''); setDescription(''); setPrice(''); setDiscount('0'); setStock('')
      setBrand(''); setSize(''); setColor('')
      setCategoryId(categories[0]?.id ?? '')
      setImages([]); setIsActive(true)
    }
    setImageInput('')
  }, [open, product, categories])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !description || !price || !stock || !categoryId) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    const payload = {
      name, description,
      price: parseFloat(price),
      discount: parseFloat(discount),
      stock: parseInt(stock),
      brand, size, color,
      categoryId,
      supplierId,
      images,
      isActive,
    }

    try {
      const url = isNew ? '/api/products' : `/api/products/${product!.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save product')
        return
      }
      toast.success(isNew ? 'Product created' : 'Product updated')
      onSaved(data, isNew)
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function addImage() {
    if (!imageInput.trim()) return
    setImages((prev) => [...prev, imageInput.trim()])
    setImageInput('')
  }
  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add new product' : 'Edit product'}</DialogTitle>
          <DialogDescription>
            {isNew ? 'List a new item in your catalog.' : 'Update product details and save changes.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-name">Name *</Label>
              <Input id="p-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Cotton T-Shirt" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc">Description *</Label>
              <Textarea id="p-desc" required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the product, materials, features…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (EGP) *</Label>
              <Input id="p-price" type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-stock">Stock *</Label>
              <Input id="p-stock" type="number" required value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-discount">Discount (%)</Label>
              <Input id="p-discount" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="p-cat"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-brand">Brand</Label>
              <Input id="p-brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-size">Size</Label>
              <Input id="p-size" value={size} onChange={(e) => setSize(e.target.value)} placeholder="M, 42, OS…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-color">Color</Label>
              <Input id="p-color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-1.5">
            <Label>Images</Label>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setImages(prev => [...prev, ev.target!.result as string])
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                  e.target.value = ''
                }}
                className="cursor-pointer file:text-foreground file:bg-muted file:border-0 file:mr-4 file:py-1 file:px-3 file:rounded-md hover:file:bg-muted/80"
              />
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs text-muted-foreground uppercase">or paste url</span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Paste image URL"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
                />
                <Button type="button" onClick={addImage} variant="outline" className="shrink-0 gap-1">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted group">
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-white"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="p-active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="p-active">Active (visible in store)</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : isNew ? 'Create Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
