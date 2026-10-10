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
            <div className="flex gap-2">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
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
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2 sm:items-center">
          <div>
            <h4 className="text-sm font-semibold">Stay in the loop</h4>
            <p className="text-xs text-muted-foreground">Subscribe for new arrivals, deals, and insider news from Egypt.</p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Enter your email" className="bg-background" />
            <Button type="submit" className="gap-2 shrink-0">
              <Send className="h-3.5 w-3.5" /> Subscribe
            </Button>
          </form>
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
