'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Logo } from '@/components/brand/logo'
import { useAuth, useCart, useUI, useWishlist } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { toast } from 'sonner'
import {
  ShoppingCart, User, Search, Menu, Sun, Moon, LogOut, LayoutDashboard,
  Package, UserCircle, Heart, Sparkles, Shield, X, ChevronRight,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Role } from '@/lib/store'

const NAV_LINKS = [
  { label: 'Home', route: { name: 'home' as const } },
  { label: 'Shop All', route: { name: 'shop' as const } },
  { label: 'Clothing', route: { name: 'shop' as const, category: 'clothing' } },
  { label: 'Electronics', route: { name: 'shop' as const, category: 'electronics' } },
  { label: 'Shoes', route: { name: 'shop' as const, category: 'shoes' } },
]

const ROLE_LABELS: Record<Role, { label: string; color: string }> = {
  GUEST: { label: 'Guest', color: 'bg-muted text-muted-foreground' },
  CUSTOMER: { label: 'Customer', color: 'bg-chart-2/15 text-chart-2' },
  SUPPLIER: { label: 'Supplier', color: 'bg-chart-4/15 text-chart-4' },
  ADMIN: { label: 'Admin', color: 'bg-primary/15 text-primary' },
}

export function Header() {
  const { user, role, logout } = useAuth()
  const { lines } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { setCartOpen } = useUI()
  const { navigate, route } = useRouter()
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = React.useState('')
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const cartCount = lines.reduce((s, l) => s + l.quantity, 0)

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate({ name: 'shop', search: search.trim() || undefined })
    setMobileOpen(false)
  }

  function handleLogout() {
    logout()
    toast.success('Signed out')
    navigate({ name: 'home' })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 lg:px-6">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-3">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => { navigate(l.route); setMobileOpen(false) }}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {l.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              <div className="my-2 h-px bg-border" />
              {!user && (
                <Button onClick={() => { navigate({ name: 'login' }); setMobileOpen(false) }} className="w-full">
                  Sign In
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <button onClick={() => navigate({ name: 'home' })} className="shrink-0">
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV_LINKS.map((l) => {
            const active = route.name === l.route.name &&
              (l.route.name !== 'shop' || (route as any).category === (l.route as any).category)
            return (
              <button
                key={l.label}
                onClick={() => navigate(l.route)}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  active ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Search */}
        <form onSubmit={onSearch} className="ml-auto hidden md:flex items-center max-w-xs flex-1">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands…"
              className="h-9 pl-9 pr-3 rounded-full bg-muted/60 border-transparent focus-visible:bg-background"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto md:ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Wishlist"
            className="relative"
            onClick={() => navigate({ name: 'wishlist' })}
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-scale-in">
                {wishlistItems.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-scale-in">
                {cartCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-3 text-xs font-bold text-primary-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    <span className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_LABELS[role].color}`}>
                      <Shield className="h-3 w-3" />
                      {ROLE_LABELS[role].label}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ name: 'profile' })}>
                  <UserCircle className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ name: 'wishlist' })}>
                  <Heart className="mr-2 h-4 w-4" /> My Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ name: 'orders' })}>
                  <Package className="mr-2 h-4 w-4" /> My Orders
                </DropdownMenuItem>
                {role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate({ name: 'admin' })}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                {role === 'SUPPLIER' && (
                  <DropdownMenuItem onClick={() => navigate({ name: 'supplier' })}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Supplier Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate({ name: 'login' })} className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Announcement bar */}
      <div className="border-t border-border/60 bg-gradient-to-r from-primary/10 via-chart-3/10 to-primary/10 text-center">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="inline h-3 w-3 mr-1 -translate-y-px" />
          Free shipping over 500 EGP · 30-day returns · New season styles just dropped across Egypt 🇪🇬
        </p>
      </div>
    </header>
  )
}
