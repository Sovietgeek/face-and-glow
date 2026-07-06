'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingStatusBadge } from '@/components/admin/booking-status-badge'
import { BookingStatusControl } from '@/components/admin/booking-status-control'
import { PaymentToggle } from '@/components/admin/payment-toggle'
import { formatINR, STATUS_LABELS } from '@/lib/constants'

type BookingWithItems = {
  id: number
  bookingDate: string
  timeSlot: string
  status: string
  totalAmount: number
  paymentStatus: string
  customerName: string
  customerPhone: string
  notes: string | null
  items: { id: number; serviceName: string; price: number }[]
}

export function BookingsTable({
  bookings,
  activeStatus,
  activeDate,
}: {
  bookings: BookingWithItems[]
  activeStatus: string
  activeDate: string
}) {
  const router = useRouter()

  function setFilter(status: string, date: string) {
    const params = new URLSearchParams()
    if (status && status !== 'all') params.set('status', status)
    if (date) params.set('date', date)
    router.push(`/admin/bookings?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={activeStatus}
            onValueChange={(v) => setFilter(v, activeDate)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={activeDate}
            onChange={(e) => setFilter(activeStatus, e.target.value)}
            className="w-full sm:w-44"
            aria-label="Filter by date"
          />
          {(activeStatus !== 'all' || activeDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('all', '')}
            >
              Clear filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No bookings match the selected filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">
                      FG-{String(b.id).padStart(4, '0')}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerPhone}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(
                          b.bookingDate + 'T00:00:00',
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.timeSlot}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="truncate text-sm">
                        {b.items.map((i) => i.serviceName).join(', ')}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {b.items.length} service
                        {b.items.length > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatINR(b.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <PaymentToggle id={b.id} paymentStatus={b.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <BookingStatusControl id={b.id} status={b.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
