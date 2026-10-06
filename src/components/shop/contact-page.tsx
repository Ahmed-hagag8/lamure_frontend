'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export function ContactPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Message sent! We\'ll be in touch soon.')
      setName(''); setEmail(''); setSubject(''); setMessage('')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">We typically respond within 24 hours, 7 days a week.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Mail, title: 'Email us', value: 'hello@lumora.shop', desc: 'General inquiries' },
          { icon: Phone, title: 'Call us', value: '+1 (555) 010-2030', desc: 'Mon–Fri, 9am–6pm' },
          { icon: MapPin, title: 'Visit us', value: '123 Market St, San Francisco', desc: 'CA 94103, USA' },
        ].map(({ icon: Icon, title, value, desc }) => (
          <Card key={title} className="text-center hover-lift">
            <CardContent className="p-6">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="text-sm text-muted-foreground">Fill out the form below and we\'ll get back to you.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Full name</Label>
              <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-subject">Subject</Label>
              <Input id="c-subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-message">Message</Label>
              <Textarea id="c-message" required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            </div>
            <Button type="submit" className="sm:col-span-2 gap-2" disabled={loading}>
              {loading ? 'Sending…' : <><Send className="h-4 w-4" /> Send message</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        Customer support hours: 24/7 · Average response time: 4 hours
      </div>
    </div>
  )
}
