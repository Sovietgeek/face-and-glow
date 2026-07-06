import { getAllBookings } from '@/app/actions/admin'
import { BookingsTable } from '@/components/admin/bookings-table'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>
}) {
  const params = await searchParams
  const bookings = await getAllBookings({
    status: params.status,
    date: params.date,
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage all appointments — confirm, progress, complete or cancel
        </p>
      </div>
      <BookingsTable
        bookings={bookings}
        activeStatus={params.status ?? 'all'}
        activeDate={params.date ?? ''}
      />
    </div>
  )
}
