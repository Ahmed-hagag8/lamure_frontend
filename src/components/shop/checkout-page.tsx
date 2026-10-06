'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart, useAuth } from '@/lib/store'
import { useRouter } from '@/lib/router'
import { formatPrice, discountedPrice } from '@/lib/types'
import { CheckCircle2, Lock, CreditCard, Wallet, Banknote, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PAYMENT_METHODS = [
  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'WALLET', label: 'Digital Wallet', icon: Wallet, desc: 'Apple Pay, Google Pay' },
  { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
]

export function CheckoutPage() {
  const { lines, clear } = useCart()
  const { user, role, hasHydrated } = useAuth()
  const { navigate } = useRouter()

  const [step, setStep] = React.useState<'form' | 'processing' | 'done'>('form')
  const [orderId, setOrderId] = React.useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = React.useState('CARD')

  // Shipping form
  const [fullName, setFullName] = React.useState(user?.name ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')
  const [phone, setPhone] = React.useState(user?.phone ?? '')
  const [address, setAddress] = React.useState(user?.address ?? '')
  const [city, setCity] = React.useState('')
  const [zip, setZip] = React.useState('')
  const [country, setCountry] = React.useState('United States')

  // Card form (test only)
  const [cardNumber, setCardNumber] = React.useState('4242 4242 4242 4242')
  const [cardName, setCardName] = React.useState(user?.name ?? '')
  const [expiry, setExpiry] = React.useState('12/28')
  const [cvc, setCvc] = React.useState('123')

  const subtotal = lines.reduce((s, l) => s + discountedPrice(l.price, l.discount) * l.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  React.useEffect(() => {
    if (!hasHydrated) return
    if ((role !== 'CUSTOMER' && role !== 'ADMIN') || lines.length === 0) {
      if (step !== 'done') navigate({ name: 'cart' })
    }
  }, [role, lines.length, navigate, hasHydrated, step])

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (lines.length === 0 && step !== 'done') {
    return null
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setStep('processing')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          address: `${address}, ${city}, ${zip}, ${country}`,
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to place order')
        setStep('form')
        return
      }
      setOrderId(data.id)
      clear()
      setStep('done')
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error('Something went wrong')
      setStep('form')
    }
  }

  if (step === 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary animate-scale-in">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Thank you for your order!</h1>
            <p className="mt-2 text-muted-foreground">
              Your order has been confirmed. A confirmation email will arrive shortly.
            </p>
            {orderId && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-medium">{orderId.slice(0, 12).toUpperCase()}</span>
              </div>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate({ name: 'orders' })}>View my orders</Button>
              <Button variant="outline" onClick={() => navigate({ name: 'shop' })}>Continue shopping</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 lg:px-6 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-6 text-2xl font-bold">Processing your payment…</h2>
        <p className="mt-2 text-muted-foreground">Securely connecting to our payment provider. Please don\'t close this page.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <button onClick={() => navigate({ name: 'cart' })} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>

      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="mt-1 text-muted-foreground">Complete your purchase securely.</p>

      <form onSubmit={placeOrder} className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                Shipping information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street and number" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zip">ZIP / Postal</Label>
                <Input id="zip" required value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" required value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                Payment method
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Lock className="h-3 w-3" /> Test mode
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-2">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon
                  return (
                    <Label
                      key={m.id}
                      htmlFor={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                        paymentMethod === m.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                      }`}
                    >
                      <RadioGroupItem value={m.id} id={m.id} />
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </Label>
                  )
                })}
              </RadioGroup>

              {paymentMethod === 'CARD' && (
                <div className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2 animate-fade-in-up">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cardName">Name on card</Label>
                    <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
                  </div>
                  <p className="sm:col-span-2 text-xs text-muted-foreground">
                    Test mode — no real charge will be made. Use card <span className="font-mono">4242 4242 4242 4242</span>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {lines.map((l) => {
                const unitPrice = discountedPrice(l.price, l.discount)
                return (
                  <li key={l.productId} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {l.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-2 text-xs font-medium">{l.name}</p>
                      <p className="mt-auto text-sm font-semibold">{formatPrice(unitPrice * l.quantity)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/20">
              <Lock className="h-4 w-4" />
              Pay {formatPrice(total)}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By placing your order, you agree to our Terms and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
