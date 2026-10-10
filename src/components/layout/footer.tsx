'use client'

import { Logo } from '@/components/brand/logo'
import { useRouter } from '@/lib/router'
import { Twitter, Instagram, Facebook, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', route: { name: 'shop' as const } },
      { label: 'Clothing', route: { name: 'shop' as const, category: 'clothing' } },
      { label: 'Electronics', route: { name: 'shop' as const, category: 'electronics' } },
      { label: 'Shoes', route: { name: 'shop' as const, category: 'shoes' } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', route: { name: 'about' as const } },
      { label: 'Contact', route: { name: 'contact' as const } },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', route: { name: 'login' as const } },
      { label: 'Register', route: { name: 'register' as const } },
      { label: 'My Orders', route: { name: 'orders' as const } },
    ],
  },
]

export function Footer() {
  const { navigate } = useRouter()

  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm">
              Lamure is Egypt's premium multi-category marketplace connecting customers,
              suppliers, and administrators. Shop clothing, electronics, and shoes with a 
              beautiful, modern experience — all with Egyptian quality and style.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="group grid h-10 w-10 place-items-center rounded-xl border border-transparent bg-muted/50 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => navigate(l.route)}
                      className="group flex items-center text-sm text-muted-foreground transition-all duration-200 hover:text-primary"
                    >
                      <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-2 group-hover:mr-1 opacity-0 group-hover:opacity-100 text-primary">›</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-1 backdrop-blur-xl shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-50" />
          <div className="relative grid gap-4 rounded-[20px] bg-card/80 p-6 sm:grid-cols-2 sm:items-center">
            <div>
              <h4 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Stay in the loop</h4>
              <p className="mt-1 text-sm text-muted-foreground">Subscribe for new arrivals, deals, and insider news from Egypt.</p>
            </div>
            <form className="flex gap-2 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="Enter your email" className="bg-background/80 backdrop-blur-sm border-muted-foreground/20 focus-visible:ring-primary/30 shadow-inner h-11" />
              <Button type="submit" className="gap-2 shrink-0 h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Send className="h-4 w-4" /> Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Lamure Egypt. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Terms</button>
            <button className="hover:text-foreground transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
