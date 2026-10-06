'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  AreaChart, Area, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, Package, DollarSign, ShoppingCart, TrendingUp,
  Search, Trash2, ArrowUpRight, ArrowDownRight, AlertTriangle, UserCog,
} from 'lucide-react'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, type ProductDTO } from '@/lib/types'
import { toast } from 'sonner'

interface Stats {
  totals: { users: number; products: number; orders: number; categories: number; revenue: number }
  categories: { name: string; slug: string; productCount: number }[]
  usersByRole: Record<string, number>
  lowStock: { id: string; name: string; stock: number; category: string; supplier: string }[]
}

interface ChartData {
  days: { date: string; label: string; total: number; count: number }[]
  byCategory: { name: string; value: number }[]
}

const PIE_COLORS = ['#10b981', '#06b6d4', '#eab308', '#f97316', '#a855f7']

export function AdminDashboard() {
  const { user, role, hasHydrated } = useAuth()
  const { navigate } = useRouter()

  const [stats, setStats] = React.useState<Stats | null>(null)
  const [chart, setChart] = React.useState<ChartData | null>(null)
  const [users, setUsers] = React.useState<any[]>([])
  const [products, setProducts] = React.useState<ProductDTO[]>([])
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('all')

  React.useEffect(() => {
    if (!hasHydrated) return
    if (role !== 'ADMIN') {
      navigate({ name: 'home' })
      return
    }
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/sales-chart').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/products?limit=100').then((r) => r.json()),
    ]).then(([s, c, u, p]) => {
      setStats(s)
      setChart(c)
      setUsers(u)
      setProducts(p)
    })
  }, [role, navigate, hasHydrated])

  if (!hasHydrated || role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading dashboard…</p>
      </div>
    )
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  async function deleteUser(id: string) {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User deleted')
    } else {
      toast.error('Failed to delete user')
    }
  }

  async function changeRole(id: string, newRole: string) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)))
      toast.success('Role updated')
    } else {
      toast.error('Failed to update role')
    }
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted')
    } else {
      toast.error('Failed to delete product')
    }
  }

  const stats_cards = stats ? [
    { label: 'Total Revenue', value: formatPrice(stats.totals.revenue), change: '+12.5%', up: true, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'Orders', value: stats.totals.orders.toString(), change: '+8.2%', up: true, icon: ShoppingCart, color: 'from-cyan-500 to-blue-500' },
    { label: 'Products', value: stats.totals.products.toString(), change: '+3.1%', up: true, icon: Package, color: 'from-amber-500 to-orange-500' },
    { label: 'Users', value: stats.totals.users.toString(), change: '-1.4%', up: false, icon: Users, color: 'from-purple-500 to-pink-500' },
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Admin Dashboard
            <Badge variant="secondary" className="gap-1">
              <UserCog className="h-3 w-3" /> {user?.name}
            </Badge>
          </h1>
          <p className="mt-1 text-muted-foreground">Monitor your store performance, inventory, and users.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="overflow-hidden hover-lift animate-fade-in-up" >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Sales trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Sales — last 7 days
            </CardTitle>
            <CardDescription>Revenue and order count by day.</CardDescription>
          </CardHeader>
          <CardContent>
            {chart ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chart.days}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fill="url(#rev)" name="Revenue ($)" />
                  <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} fill="url(#ord)" name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] animate-pulse rounded-lg bg-muted" />
            )}
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category mix</CardTitle>
            <CardDescription>Products per category.</CardDescription>
          </CardHeader>
          <CardContent>
            {chart ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chart.byCategory.length ? chart.byCategory : stats?.categories.map((c) => ({ name: c.name, value: c.productCount })) || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {(chart.byCategory.length ? chart.byCategory : stats?.categories || []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] animate-pulse rounded-lg bg-muted" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low stock + Users by role */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low stock alerts
            </CardTitle>
            <CardDescription>Products with less than 10 units remaining.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.lowStock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-muted-foreground">{p.supplier}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={p.stock <= 5 ? 'destructive' : 'secondary'} className="rounded-full">
                        {p.stock} left
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {stats?.lowStock.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">All products are well-stocked.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
            <CardDescription>Distribution of accounts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats && Object.entries(stats.usersByRole).map(([role, count], i) => {
              const total = Object.values(stats.usersByRole).reduce((s, c) => s + c, 0)
              const pct = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={role}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{role}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* User management */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> User management</CardTitle>
              <CardDescription>Search, change roles, or remove users.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users…"
                  className="w-56 pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customers</SelectItem>
                  <SelectItem value="SUPPLIER">Suppliers</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-3 text-xs font-bold text-primary-foreground">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={(v) => changeRole(u.id, v)}>
                        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="SUPPLIER">Supplier</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" disabled={u.id === user?.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <span className="font-medium">{u.name}</span> ({u.email}). This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser(u.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Inventory</CardTitle>
          <CardDescription>Edit stock and manage products.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                    <TableCell>{p.categoryName}</TableCell>
                    <TableCell>{formatPrice(p.price)}</TableCell>
                    <TableCell>
                      <Badge variant={p.stock <= 5 ? 'destructive' : p.stock <= 10 ? 'secondary' : 'outline'} className="rounded-full">
                        {p.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isActive ? 'default' : 'secondary'} className="rounded-full">
                        {p.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'product', id: p.id })}>View</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete product?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently remove "{p.name}" from your store.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
