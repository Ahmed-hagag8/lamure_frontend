'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { User, Mail, Phone, MapPin, Shield, ShoppingBag, Package, Save, LogOut, Plus, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user, role, logout, hasHydrated } = useAuth()
  const { navigate } = useRouter()

  const [name, setName] = React.useState(user?.name ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')
  const [phone, setPhone] = React.useState(user?.phone ?? '')
  const [address, setAddress] = React.useState(user?.address ?? '')
  const [loading, setLoading] = React.useState(false)

  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [savingPassword, setSavingPassword] = React.useState(false)

  // Address Book State
  const [addresses, setAddresses] = React.useState<any[]>([])
  const [showAddressForm, setShowAddressForm] = React.useState(false)
  const [addressForm, setAddressForm] = React.useState({
    label: '', full_name: '', phone: '', street_address: '', city: '', state: '', postal_code: '', is_default: false
  })
  const [loadingAddresses, setLoadingAddresses] = React.useState(false)
  React.useEffect(() => {
    if (!hasHydrated) return
    if (!user) navigate({ name: 'login' })
  }, [user, navigate, hasHydrated])

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone ?? '')
      fetchAddresses()
    }
  }, [user])

  async function fetchAddresses() {
    if (!user) return
    try {
      const res = await fetch(`/api/users/${user.id}/addresses`)
      if (res.ok) {
        setAddresses(await res.json())
      }
    } catch (err) {}
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault()
    setLoadingAddresses(true)
    try {
      const res = await fetch(`/api/users/${user!.id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      })
      if (res.ok) {
        toast.success('Address saved successfully')
        setShowAddressForm(false)
        setAddressForm({ label: '', full_name: '', phone: '', street_address: '', city: '', state: '', postal_code: '', is_default: false })
        fetchAddresses()
      } else {
        toast.error('Failed to save address')
      }
    } finally {
      setLoadingAddresses(false)
    }
  }

  async function handleDeleteAddress(id: string) {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Address deleted')
        fetchAddresses()
      }
    } catch (err) {}
  }

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
        body: JSON.stringify({ name, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update profile')
        return
      }
      // Update local state via setUser
      useAuth.getState().setUser({ ...user!, name, email, phone })
      toast.success('Profile updated')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields')
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch(`/api/users/${user!.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to update password')
        return
      }
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setSavingPassword(false)
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
                <Label htmlFor="address">Address (Legacy)</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-9" placeholder="Moved to Address Book below" disabled />
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

        {/* Security / Password */}
        <Card className="lg:col-span-2 lg:col-start-2">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={savingPassword} variant="secondary" className="gap-2">
                  <Shield className="h-4 w-4" />
                  {savingPassword ? 'Updating…' : 'Update Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Address Book */}
        <Card className="lg:col-span-2 lg:col-start-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Address Book</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
              {showAddressForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Add Address</>}
            </Button>
          </CardHeader>
          <CardContent>
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="grid gap-4 sm:grid-cols-2 mb-8 p-4 border rounded-xl bg-muted/20">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Label (e.g., Home, Work)</Label>
                  <Input value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input required value={addressForm.full_name} onChange={e => setAddressForm({...addressForm, full_name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Street Address *</Label>
                  <Input required value={addressForm.street_address} onChange={e => setAddressForm({...addressForm, street_address: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>State / Province</Label>
                  <Input value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>Postal Code</Label>
                  <Input value={addressForm.postal_code} onChange={e => setAddressForm({...addressForm, postal_code: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_default" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <Label htmlFor="is_default">Set as default address</Label>
                </div>
                <div className="sm:col-span-2 mt-2">
                  <Button type="submit" disabled={loadingAddresses} className="w-full sm:w-auto">
                    Save Address
                  </Button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map(addr => (
                <div key={addr.id} className="relative rounded-xl border bg-card p-4 hover:shadow-md transition-shadow">
                  {addr.is_default && (
                    <Badge className="absolute top-4 right-4" variant="secondary">Default</Badge>
                  )}
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {addr.label || 'Address'}
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{addr.full_name}</p>
                    <p>{addr.street_address}</p>
                    <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postal_code}</p>
                    <p className="mt-2 flex items-center gap-1"><Phone className="h-3 w-3" /> {addr.phone}</p>
                  </div>
                  <div className="mt-4 flex gap-2 border-t pt-3">
                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteAddress(addr.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {!showAddressForm && addresses.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                  No addresses saved yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
