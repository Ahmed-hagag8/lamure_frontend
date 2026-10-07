'use client'

import * as React from 'react'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, ShieldCheck, Truck, BadgeCheck } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/store'
import { toast } from 'sonner'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@lamure.eg', password: 'admin123', role: 'ADMIN' },
  { label: 'Supplier', email: 'supplier@lamure.eg', password: 'supplier123', role: 'SUPPLIER' },
  { label: 'Customer', email: 'customer@lamure.eg', password: 'customer123', role: 'CUSTOMER' },
]

export function AuthPage({ mode: initialMode = 'login' }: { mode?: 'login' | 'register' }) {
  const [mode, setMode] = React.useState<'login' | 'register'>(initialMode)
  const [loading, setLoading] = React.useState(false)
  const { setUser } = useAuth()
  const { navigate } = useRouter()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [regEmail, setRegEmail] = React.useState('')
  const [regPassword, setRegPassword] = React.useState('')
  const [role, setRole] = React.useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Login failed'); return }
      setUser(data)
      toast.success(`Welcome back, ${data.name}!`)
      if (data.role === 'ADMIN') navigate({ name: 'admin' })
      else if (data.role === 'SUPPLIER') navigate({ name: 'supplier' })
      else navigate({ name: 'home' })
    } finally { setLoading(false) }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: regEmail, password: regPassword, role }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Registration failed'); return }
      setUser(data)
      toast.success('Account created!')
      if (role === 'SUPPLIER') navigate({ name: 'supplier' })
      else navigate({ name: 'home' })
    } finally { setLoading(false) }
  }

  function quickFill(demo: typeof DEMO_ACCOUNTS[number]) {
    setEmail(demo.email); setPassword(demo.password); setMode('login')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-xl md:grid-cols-2">
        {/* Visual */}
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-chart-3 p-8 text-primary-foreground">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3), transparent 40%)',
          }} />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> Premium marketplace
            </div>
            <h2 className="text-3xl font-bold leading-tight">Shop, sell, and manage — all in one place.</h2>
            <p className="text-sm text-primary-foreground/80">Lamure connects Egyptian customers, suppliers, and admins in a beautifully crafted commerce experience.</p>
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

        {/* Form */}
        <div className="p-6 md:p-8">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' ? 'Sign in to continue to your account.' : 'Join Lamure Egypt and start shopping or selling.'}
            </CardDescription>
          </CardHeader>

          {/* Tabs */}
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setMode('login')}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${mode === 'register' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
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
          ) : (
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
          )}

          {/* Demo access */}
          <div className="mt-5">
            <div className="mb-2 text-center text-xs text-muted-foreground">Quick demo access</div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.label}
                  onClick={() => quickFill(d)}
                  className="rounded-lg border bg-card px-2 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Click a role above, then press "Sign In" — no real password needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
