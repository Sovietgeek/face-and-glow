import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { BookingForm } from '@/components/booking-form'

export const metadata: Metadata = { title: 'Book Appointment' }

export default async function BookingPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
          Book Your Appointment
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a date and time slot, confirm your details, and you&apos;re all set.
        </p>
      </div>
      <BookingForm defaultName={user.name} defaultPhone={user.phone ?? ''} />
    </div>
  )
}
