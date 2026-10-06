'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/shop/product-card'
import { useRouter } from '@/lib/router'
import { formatPrice } from '@/lib/types'
import {
  ArrowRight, Sparkles, Truck, ShieldCheck, Headphones, RefreshCw,
  Shirt, Smartphone, Footprints, Star, ChevronRight, TrendingUp,
} from 'lucide-react'

interface HomeProps {
  categories: { id: string; name: string; slug: string; description?: string | null; image?: string | null; productCount: number }[]
  featured: any[]
}

const CATEGORY_ICONS: Record<string, any> = {
  clothing: Shirt,
  electronics: Smartphone,
  shoes: Footprints,
}

const HERO_SLIDES = [
  {
    eyebrow: 'New season · 2026',
    title: 'Style that moves with you',
    description: 'Discover the season\'s freshest clothing, electronics, and shoes — curated by Lumora.',
    cta: 'Shop the collection',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    accent: 'from-chart-3/30 via-primary/15 to-transparent',
  },
  {
    eyebrow: 'Tech that empowers',
    title: 'Next-gen gadgets, today',
    description: 'From noise-cancelling audio to smart wearables — find the gear that fits your life.',
    cta: 'Explore electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
    accent: 'from-chart-2/30 via-chart-2/10 to-transparent',
  },
  {
    eyebrow: 'Step into the moment',
    title: 'Footwear for every step',
    description: 'Run, hike, or stroll in style with our premium selection of shoes.',
    cta: 'Browse shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80',
    accent: 'from-chart-4/30 via-chart-4/10 to-transparent',
  },
]

export function HomePage({ categories, featured }: HomeProps) {
  const { navigate } = useRouter()
  const [slide, setSlide] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={HERO_SLIDES[slide].image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${HERO_SLIDES[slide].accent}`} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:px-6 lg:py-36">
          <motion.div
            key={`text-${slide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {HERO_SLIDES[slide].eyebrow}
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {HERO_SLIDES[slide].title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {HERO_SLIDES[slide].description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/30 group" onClick={() => navigate({ name: 'shop' })}>
                {HERO_SLIDES[slide].cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ name: 'about' })}>
                Learn more
              </Button>
            </div>
          </motion.div>

          {/* Slide dots */}
          <div className="mt-10 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slide ? 'w-10 bg-primary' : 'w-3 bg-muted-foreground/40 hover:bg-muted-foreground'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4 lg:px-6">
          {[
            { icon: Truck, title: 'Free shipping', desc: 'On orders over $75' },
            { icon: RefreshCw, title: '30-day returns', desc: 'Hassle-free refunds' },
            { icon: ShieldCheck, title: 'Secure payments', desc: 'Powered by Stripe (test)' },
            { icon: Headphones, title: '24/7 support', desc: 'We are here to help' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-2 gap-1 rounded-full">
              <Sparkles className="h-3 w-3" /> Browse
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Shop by category</h2>
            <p className="mt-1 text-muted-foreground">Find exactly what you need across our curated departments.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex gap-2 shrink-0" onClick={() => navigate({ name: 'shop' })}>
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? Sparkles
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => navigate({ name: 'shop', category: cat.slug })}
                className="group relative overflow-hidden rounded-2xl border bg-card text-left hover-lift"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-muted">
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{cat.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Shop now <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-2 gap-1 rounded-full">
              <TrendingUp className="h-3 w-3" /> Trending
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Featured products</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked favorites our customers love.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex gap-2 shrink-0" onClick={() => navigate({ name: 'shop' })}>
            See all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-chart-3 p-8 sm:p-12 text-primary-foreground">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3), transparent 40%)',
          }} />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-current" /> Limited time
              </Badge>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Mega Sale — up to 50% off premium picks
              </h2>
              <p className="text-primary-foreground/80">
                Refresh your wardrobe, gear up with new tech, and treat your feet. Don\'t miss our biggest seasonal markdown.
              </p>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate({ name: 'shop' })}>
                Shop the sale <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Off', value: '50%' },
                { label: 'Items', value: '500+' },
                { label: 'Days', value: '07' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm text-center">
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-primary-foreground/70 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-2 gap-1 rounded-full">
            <Star className="h-3 w-3 fill-current" /> Reviews
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">Loved by shoppers worldwide</h2>
          <p className="mt-1 text-muted-foreground">Real experiences from the Lumora community.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: 'Sophia R.', role: 'Verified Customer', text: 'The site is gorgeous and checkout was effortless. My order arrived in 2 days. Will definitely shop again!', rating: 5 },
            { name: 'Liam T.', role: 'Verified Customer', text: 'Quality of the electronics blew me away. The price tracking and discounts are genuinely useful.', rating: 5 },
            { name: 'Ava M.', role: 'Verified Customer', text: 'Best shoe selection I have seen in a while. The product pages are clean and the photos are stunning.', rating: 4.5 },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-6 hover-lift"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < Math.floor(t.rating) ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-3 text-sm font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
