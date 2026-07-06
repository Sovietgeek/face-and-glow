'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { CalendarDays, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import { createBooking, getBookedSlots } from '@/app/actions/bookings'
import { TIME_SLOTS, formatINR } from '@/lib/constants'
import { cn } from '@/lib/utils'

function nextDays(count: number) {
  const days: { value: string; label: string; weekday: string }[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({
      value,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    })
  }
  return days
}

export function BookingForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string
  defaultPhone: string
}) {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const days = nextDays(14)
  const [date, setDate] = useState(days[0].value)
  const [timeSlot, setTimeSlot] = useState('')
  const [name, setName] = useState(defaultName)
  const [phone, setPhone] = useState(defaultPhone)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { data: bookedSlots } = useSWR(['booked-slots', date], () => getBookedSlots(date))

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your cart is empty. Add services before booking a slot.
          </p>
          <Button render={<Link href="/services" />}>Browse Services</Button>
        </CardContent>
      </Card>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!timeSlot) {
      setError('Please select a time slot')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const result = await createBooking({
        serviceIds: items.map((i) => i.id),
        bookingDate: date,
        timeSlot,
        customerName: name,
        customerPhone: phone,
        notes,
      })
      clearCart()
      router.push(`/booking/confirmation/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Date picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <CalendarDays className="size-5 text-primary" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => {
                  setDate(d.value)
                  setTimeSlot('')
                }}
                className={cn(
                  'flex min-w-16 flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                  date === d.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary',
                )}
              >
                <span className="text-xs">{d.weekday}</span>
                <span className="font-semibold">{d.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <Clock className="size-5 text-primary" />
            Select Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TIME_SLOTS.map((slot) => {
              const isBooked = bookedSlots?.includes(slot)
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setTimeSlot(slot)}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                    isBooked
                      ? 'cursor-not-allowed border-border bg-muted text-muted-foreground line-through'
                      : timeSlot === slot
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary',
                  )}
                >
                  {slot}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Slots with a strikethrough are already booked for the selected date.
          </p>
        </CardContent>
      </Card>

      {/* Contact details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Your Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Special Requests (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any allergies, preferences, or occasions we should know about?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="font-serif text-lg font-semibold text-foreground">Booking Summary</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="text-foreground">{formatINR(item.price)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total (Pay at Salon)</span>
            <span className="font-serif text-xl font-semibold text-primary">{formatINR(total)}</span>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
