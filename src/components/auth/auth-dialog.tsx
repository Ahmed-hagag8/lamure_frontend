'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { Sparkles, ShieldCheck, Truck, BadgeCheck } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@lamure.eg', password: 'admin123', role: 'ADMIN' },
  { label: 'Supplier', email: 'supplier@lamure.eg', password: 'supplier123', role: 'SUPPLIER' },
  { label: 'Customer', email: 'customer@lamure.eg', password: 'customer123', role: 'CUSTOMER' },
]

export function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [loading, setLoading] = React.useState(false)
  const { setUser } = useAuth()
  const { navigate } = useRouter()

  // login form
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  // register form
  const [name, setName] = React.useState('')
  const [regEmail, setRegEmail] = React.useState('')
  const [regPassword, setRegPassword] = React.useState('')
  const [role, setRole] = React.useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }
      setUser(data)
      toast.success(`Welcome back, ${data.name}!`)
      onOpenChange(false)
      if (data.role === 'ADMIN') navigate({ name: 'admin' })
      else if (data.role === 'SUPPLIER') navigate({ name: 'supplier' })
      else navigate({ name: 'home' })
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: regEmail, password: regPassword, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }
      setUser(data)
      toast.success('Account created!')
      onOpenChange(false)
      if (role === 'SUPPLIER') navigate({ name: 'supplier' })
      else navigate({ name: 'home' })
    } finally {
      setLoading(false)
    }
  }

  function quickLogin(demo: typeof DEMO_ACCOUNTS[number]) {
    setEmail(demo.email)
    setPassword(demo.password)
    setMode('login')
    setTimeout(() => {
      const evt = new Event('submit', { bubbles: true, cancelable: true }) as any
      const form = document.getElementById('login-form') as HTMLFormElement | null
      form?.dispatchEvent(evt)
    }, 50)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          {/* Visual side */}
          <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-chart-3 p-8 text-primary-foreground">
            <div>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3), transparent 40%)',
              }} />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Premium marketplace
                </div>
                <h2 className="text-3xl font-bold leading-tight">
                  Shop, sell, and manage — all in one place.
                </h2>
                <p className="text-sm text-primary-foreground/80">
                  Lamure connects Egyptian customers, suppliers, and admins in a beautifully crafted commerce experience.
                </p>
              </div>
            </div>
            <div className="relative space-y-3">
              {[
                { icon: ShieldCheck, label: 'Secure payments & profiles' },
                { icon: Truck, label: 'Real-time order tracking' },
                { icon: BadgeCheck, label: 'Verified suppliers only' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome to Lamure</DialogTitle>
              <DialogDescription>Sign in or create an account to continue.</DialogDescription>
            </DialogHeader>

            <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'register')} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <form id="login-form" onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-4">
                  <p className="text-center text-xs text-muted-foreground mb-2">Quick demo access</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_ACCOUNTS.map((d) => (
                      <button
                        key={d.label}
                        onClick={() => quickLogin(d)}
                        className="rounded-lg border bg-card px-2 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Choose a password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role">I want to</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as 'CUSTOMER' | 'SUPPLIER')}>
                      <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Buy products (Customer)</SelectItem>
                        <SelectItem value="SUPPLIER">Sell products (Supplier)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
