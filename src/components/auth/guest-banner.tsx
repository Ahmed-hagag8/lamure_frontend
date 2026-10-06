'use client'

import * as React from 'react'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, UserPlus } from 'lucide-react'
import { useRouter } from '@/lib/router'

export function GuestBanner({ message = 'You\'re browsing as a guest.' }: { message?: string }) {
  const [open, setOpen] = React.useState(false)
  const { navigate } = useRouter()
  return (
    <>
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{message}</p>
              <p className="text-xs text-muted-foreground">Sign in to add items to your cart and checkout.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate({ name: 'register' })} className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Register
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>Sign in</Button>
          </div>
        </CardContent>
      </Card>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
