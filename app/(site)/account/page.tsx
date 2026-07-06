import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { getMyBookings } from '@/app/actions/bookings'
import { Card, CardContent } from '@/components/ui/card'
import { BookingHistoryList } from '@/components/booking-history-list'
import { formatINR } from '@/lib/constants'
import { CalendarCheck, IndianRupee, User } from 'lucide-react'

export const metadata: Metadata = { title: 'My Bookings' }

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const bookings = await getMyBookings()
  const completed = bookings.filter((b) => b.status === 'completed')
  const totalSpent = completed.reduce((s, b) => s + b.totalAmount, 0)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
          My Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.name}. Here is your booking history and activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
              <User className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Member</span>
              <span className="truncate text-sm font-semibold text-foreground">{user.email}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
              <CalendarCheck className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Bookings</span>
              <span className="text-sm font-semibold text-foreground">{bookings.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
              <IndianRupee className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Spent</span>
              <span className="text-sm font-semibold text-foreground">{formatINR(totalSpent)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingHistoryList bookings={bookings} />
    </div>
  )
}
