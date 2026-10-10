'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'GUEST' | 'CUSTOMER' | 'ADMIN' | 'SUPPLIER'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string | null
  phone?: string | null
  address?: string | null
}

interface AuthState {
  user: SessionUser | null
  role: Role
  hasHydrated: boolean
  setUser: (user: SessionUser | null) => void
  setRole: (role: Role) => void
  logout: () => void
  setHasHydrated: (v: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: 'GUEST',
      hasHydrated: false,
      setUser: (user) =>
        set({ user, role: user?.role ?? 'GUEST', hasHydrated: true }),
      setRole: (role) => set({ role }),
      logout: () => set({ user: null, role: 'GUEST' }),
      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
    }),
    {
      name: 'shop-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

// SSR safety: if window is undefined, mark as hydrated immediately
if (typeof window === 'undefined') {
  useAuth.setState({ hasHydrated: true })
}

export interface CartLine {
  productId: string
  name: string
  price: number
  discount: number
  image: string
  quantity: number
  stock: number
}

interface CartState {
  lines: CartLine[]
  add: (line: CartLine) => void
  remove: (productId: string) => void
  setQuantity: (productId: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === line.productId)
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === line.productId
                  ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
                  : l
              ),
            }
          }
          return { lines: [...s.lines, line] }
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, qty) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.max(1, Math.min(qty, l.stock)) }
              : l
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'shop-cart' }
  )
)

interface UIState {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  authDialogOpen: boolean
  setAuthDialogOpen: (open: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  authDialogOpen: false,
  setAuthDialogOpen: (open) => set({ authDialogOpen: open }),
}))

export interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  categorySlug: string
}

interface WishlistState {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  has: (productId: string) => boolean
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) => {
          const exists = s.items.some((i) => i.productId === item.productId)
          if (exists) {
            return { items: s.items.filter((i) => i.productId !== item.productId) }
          }
          return { items: [...s.items, item] }
        }),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: 'shop-wishlist' }
  )
)
