'use client'

import { ShoppingBag } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary to-chart-3 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105">
        <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-chart-4 animate-pulse-glow" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight">Lamure</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Egypt</span>
      </div>
    </div>
  )
}
