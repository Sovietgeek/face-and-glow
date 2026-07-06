import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CheckCircle2, CalendarDays, Clock, Phone, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getMyBookingById } from '@/app/actions/bookings'
import { getSession } from '@/lib/session'
import { formatINR, STATUS_LABELS, SALON_INFO } from '@/lib/constants'

export const metadata: Metadata = { title: 'Booking Confirmed' }

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const { id } = await params
  const bookingId = Number(id)
  if (!Number.isInteger(bookingId)) notFound()

  const booking = await getMyBookingById(bookingId)
  if (!booking) notFound()

  const dateLabel = new Date(booking.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-14 text-primary" />
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
          Booking Received!
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          Thank you, {booking.customerName}! Your appointment request has been
          received. Our team will confirm it shortly — you can track the status
          in My Bookings.
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Booking ID</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              #FG-{String(booking.id).padStart(4, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary">{STATUS_LABELS[booking.status] ?? booking.status}</Badge>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm text-foreground">{dateLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-primary" />
            <span className="text-sm text-foreground">{booking.timeSlot}</span>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="size-4 text-primary" />
            <span className="text-sm text-foreground">Pay at Salon</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            {booking.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.serviceName}</span>
                <span className="text-foreground">{formatINR(item.price)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-serif text-xl font-semibold text-primary">
              {formatINR(booking.totalAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="size-4" />
          Questions? Call us at {SALON_INFO.phone}
        </p>
        <div className="flex gap-3">
          <Button render={<Link href="/account" />}>View My Bookings</Button>
          <Button render={<Link href="/" />} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
