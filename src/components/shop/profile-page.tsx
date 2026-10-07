'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { User, Mail, Phone, MapPin, Shield, ShoppingBag, Package, Save, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user, role, logout, hasHydrated } = useAuth()
  const { navigate } = useRouter()

  const [name, setName] = React.useState(user?.name ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')
  const [phone, setPhone] = React.useState(user?.phone ?? '')
  const [address, setAddress] = React.useState(user?.address ?? '')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!hasHydrated) return
    if (!user) navigate({ name: 'login' })
  }, [user, navigate, hasHydrated])

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone ?? '')
      setAddress(user.address ?? '')
    }
  }, [user])

  if (!hasHydrated || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading profile…</p>
      </div>
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${user!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update profile')
        return
      }
      // Update local state via setUser
      useAuth.getState().setUser({ ...user!, name, email, phone, address })
      toast.success('Profile updated')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      <p className="mt-1 text-muted-foreground">Manage your personal information and account settings.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Profile card */}
        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-3 text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                {user.name.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 gap-1">
                <Shield className="h-3 w-3" />
                {role}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate({ name: 'orders' })}>
                <Package className="h-4 w-4" /> My Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate({ name: 'cart' })}>
                <ShoppingBag className="h-4 w-4" /> My Cart
              </Button>
              {role === 'ADMIN' && (
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate({ name: 'admin' })}>
                  <Shield className="h-4 w-4" /> Admin Dashboard
                </Button>
              )}
              {role === 'SUPPLIER' && (
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate({ name: 'supplier' })}>
                  <Shield className="h-4 w-4" /> Supplier Dashboard
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => { logout(); navigate({ name: 'home' }); toast.success('Signed out') }}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" placeholder="+20 100-XXX-XXXX" />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-9" placeholder="Your shipping address" />
                </div>
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving…' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setName(user!.name)
                  setEmail(user!.email)
                  setPhone(user!.phone ?? '')
                  setAddress(user!.address ?? '')
                }}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
