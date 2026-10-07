'use client'

import * as React from 'react'

type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: string; search?: string }
  | { name: 'product'; id: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'profile' }
  | { name: 'orders' }
  | { name: 'admin' }
  | { name: 'supplier' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'login' }
  | { name: 'register' }

interface RouterCtx {
  route: Route
  navigate: (route: Route) => void
}

const Ctx = React.createContext<RouterCtx | null>(null)

function parseHash(): Route {
  if (typeof window === 'undefined') return { name: 'home' }
  const hash = window.location.hash.replace(/^#/, '')
  const [path, query] = hash.split('?')
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'home' }

  const params = new URLSearchParams(query || '')
  switch (parts[0]) {
    case 'shop':
      return { name: 'shop', category: params.get('category') || undefined, search: params.get('search') || undefined }
    case 'product':
      return parts[1] ? { name: 'product', id: parts[1] } : { name: 'home' }
    case 'cart':
      return { name: 'cart' }
    case 'checkout':
      return { name: 'checkout' }
    case 'profile':
      return { name: 'profile' }
    case 'orders':
      return { name: 'orders' }
    case 'admin':
      return { name: 'admin' }
    case 'supplier':
      return { name: 'supplier' }
    case 'about':
      return { name: 'about' }
    case 'contact':
      return { name: 'contact' }
    case 'login':
      return { name: 'login' }
    case 'register':
      return { name: 'register' }
    default:
      return { name: 'home' }
  }
}

function toHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'shop': {
      const params = new URLSearchParams()
      if (route.category) params.set('category', route.category)
      if (route.search) params.set('search', route.search)
      const q = params.toString()
      return q ? `#/shop?${q}` : '#/shop'
    }
    case 'product':
      return `#/product/${route.id}`
    case 'cart':
      return '#/cart'
    case 'checkout':
      return '#/checkout'
    case 'profile':
      return '#/profile'
    case 'orders':
      return '#/orders'
    case 'admin':
      return '#/admin'
    case 'supplier':
      return '#/supplier'
    case 'about':
      return '#/about'
    case 'contact':
      return '#/contact'
    case 'login':
      return '#/login'
    case 'register':
      return '#/register'
  }
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = React.useState<Route>({ name: 'home' })

  React.useEffect(() => {
    setRoute(parseHash())
    const onHashChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = React.useCallback((next: Route) => {
    window.location.hash = toHash(next)
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return <Ctx.Provider value={{ route, navigate }}>{children}</Ctx.Provider>
}

export function useRouter() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
