import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookingStatusBadge } from '@/components/admin/booking-status-badge'
import { BookingStatusControl } from '@/components/admin/booking-status-control'
import { formatINR } from '@/lib/constants'
import { Clock } from 'lucide-react'

type BookingWithItems = {
  id: number
  timeSlot: string
  status: string
  totalAmount: number
  customerName: string
  customerPhone: string
  items: { id: number; serviceName: string }[]
}

export function TodaySchedule({ bookings }: { bookings: BookingWithItems[] }) {
  const sorted = [...bookings].sort((a, b) =>
    a.timeSlot.localeCompare(b.timeSlot),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Today&apos;s Schedule</CardTitle>
        <CardDescription>
          {bookings.length === 0
            ? 'No appointments booked for today.'
            : `${bookings.length} appointment${bookings.length > 1 ? 's' : ''} today — time alerts below`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            When customers book for today, they will appear here.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {sorted.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {b.timeSlot}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {b.customerName}{' '}
                      <span className="text-muted-foreground">
                        · {b.customerPhone}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.items.map((i) => i.serviceName).join(', ')} ·{' '}
                      {formatINR(b.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  <BookingStatusControl id={b.id} status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
