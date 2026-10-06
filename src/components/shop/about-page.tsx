'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { Sparkles, Heart, Shield, Users, Globe, Award } from 'lucide-react'

export function AboutPage() {
  const { navigate } = useRouter()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3 gap-1 rounded-full">
          <Sparkles className="h-3 w-3" /> Our story
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for shoppers, sellers, and teams</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Lumora was born from a simple idea: a modern marketplace should be beautiful,
          fast, and effortless for everyone — customers, suppliers, and admins alike.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Users, title: 'For everyone', desc: 'Four tailored experiences — customers, admins, suppliers, and guests — each with the right tools.' },
          { icon: Shield, title: 'Trust first', desc: 'Secure payments, verified suppliers, and quality assurance on every purchase.' },
          { icon: Globe, title: 'Multi-category', desc: 'Clothing, electronics, and shoes — curated departments covering the essentials of modern life.' },
          { icon: Heart, title: 'Designed with care', desc: 'Every interaction is crafted to be intuitive, animated, and delightful.' },
          { icon: Award, title: 'Premium quality', desc: 'We partner with reputable suppliers to bring you products worth loving.' },
          { icon: Sparkles, title: 'Always evolving', desc: 'We ship improvements every week, guided by our community\'s feedback.' },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="rounded-2xl border bg-card p-6 hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary to-chart-3 p-8 text-center text-primary-foreground sm:p-12">
        <h2 className="text-3xl font-bold">Ready to start shopping?</h2>
        <p className="mt-2 text-primary-foreground/80 max-w-xl mx-auto">
          Join thousands of happy customers and discover the Lumora difference today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" onClick={() => navigate({ name: 'shop' })}>Browse products</Button>
          <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 hover:text-primary-foreground" onClick={() => navigate({ name: 'register' })}>Create account</Button>
        </div>
      </div>
    </div>
  )
}
