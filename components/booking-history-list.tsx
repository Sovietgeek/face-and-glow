'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cancelMyBooking } from '@/app/actions/bookings'
import { formatINR, STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BookingItem = {
  id: number
  serviceName: string
  price: number
  durationMinutes: number
}

type Booking = {
  id: number
  bookingDate: string
  timeSlot: string
  status: string
  totalAmount: number
  createdAt: Date | string
  items: BookingItem[]
}

const statusStyle: Record<string, string> = {
  pending: 'bg-secondary text-secondary-foreground',
  confirmed: 'bg-primary/15 text-primary',
  in_progress: 'bg-accent text-accent-foreground',
  completed: 'bg-primary text-primary-foreground',
  cancelled: 'bg-muted text-muted-foreground',
}

export function BookingHistoryList({ bookings }: { bookings: Booking[] }) {
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t made any bookings yet.
          </p>
          <Button render={<Link href="/services" />}>Book Your First Appointment</Button>
        </CardContent>
      </Card>
    )
  }

  function handleCancel() {
    if (cancelId === null) return
    startTransition(async () => {
      await cancelMyBooking(cancelId)
      setCancelId(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-semibold text-foreground">Booking History</h2>
      {bookings.map((booking) => {
        const dateLabel = new Date(booking.bookingDate + 'T00:00:00').toLocaleDateString(
          'en-IN',
          { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
        )
        const cancellable = booking.status === 'pending' || booking.status === 'confirmed'
        return (
          <Card key={booking.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    #FG-{String(booking.id).padStart(4, '0')}
                  </span>
                  <Badge className={cn('border-transparent', statusStyle[booking.status])}>
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </Badge>
                </div>
                <span className="font-serif text-lg font-semibold text-primary">
                  {formatINR(booking.totalAmount)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {dateLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {booking.timeSlot}
                </span>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {booking.items.map((item) => (
                  <Badge key={item.id} variant="outline" className="font-normal">
                    {item.serviceName}
                  </Badge>
                ))}
              </div>
              {cancellable && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelId(booking.id)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <Dialog open={cancelId !== null} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Cancel this booking?</DialogTitle>
            <DialogDescription>
              This will cancel your appointment. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
              {isPending ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
