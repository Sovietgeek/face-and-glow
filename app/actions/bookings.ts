'use server'

import { db } from '@/lib/db'
import { bookings, bookingItems, services } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { TIME_SLOTS } from '@/lib/constants'
import { and, desc, eq, inArray, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getBookedSlots(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return []
  const rows = await db
    .select({ timeSlot: bookings.timeSlot })
    .from(bookings)
    .where(and(eq(bookings.bookingDate, dateStr), ne(bookings.status, 'cancelled')))
  return rows.map((r) => r.timeSlot)
}

export async function createBooking(input: {
  serviceIds: number[]
  bookingDate: string
  timeSlot: string
  customerName: string
  customerPhone: string
  notes?: string
}) {
  const userId = await getUserId()

  // Validate input
  if (!input.serviceIds.length) throw new Error('No services selected')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.bookingDate)) throw new Error('Invalid date')
  if (!(TIME_SLOTS as readonly string[]).includes(input.timeSlot))
    throw new Error('Invalid time slot')
  const name = input.customerName.trim()
  const phone = input.customerPhone.trim()
  if (name.length < 2) throw new Error('Please enter your name')
  if (!/^[+\d][\d\s-]{8,14}$/.test(phone)) throw new Error('Please enter a valid phone number')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const chosen = new Date(input.bookingDate + 'T00:00:00')
  if (chosen < today) throw new Error('Booking date cannot be in the past')

  // Check slot availability
  const taken = await getBookedSlots(input.bookingDate)
  if (taken.includes(input.timeSlot))
    throw new Error('This time slot is already booked. Please choose another slot.')

  // Fetch services server-side (never trust client prices)
  const selected = await db
    .select()
    .from(services)
    .where(and(inArray(services.id, input.serviceIds), eq(services.isActive, true)))
  if (!selected.length) throw new Error('Selected services not found')

  const total = selected.reduce((sum, s) => sum + s.price, 0)

  const [booking] = await db
    .insert(bookings)
    .values({
      userId,
      bookingDate: input.bookingDate,
      timeSlot: input.timeSlot,
      totalAmount: total,
      customerName: name,
      customerPhone: phone,
      notes: input.notes?.trim() || null,
    })
    .returning()

  await db.insert(bookingItems).values(
    selected.map((s) => ({
      bookingId: booking.id,
      serviceId: s.id,
      serviceName: s.name,
      price: s.price,
      durationMinutes: s.durationMinutes,
    })),
  )

  revalidatePath('/account')
  revalidatePath('/admin')
  return { id: booking.id }
}

export async function getMyBookings() {
  const userId = await getUserId()
  const myBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt))

  if (!myBookings.length) return []

  const items = await db
    .select()
    .from(bookingItems)
    .where(
      inArray(
        bookingItems.bookingId,
        myBookings.map((b) => b.id),
      ),
    )

  return myBookings.map((b) => ({
    ...b,
    items: items.filter((i) => i.bookingId === b.id),
  }))
}

export async function getMyBookingById(id: number) {
  const userId = await getUserId()
  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))
    .limit(1)
  if (!booking) return null
  const items = await db
    .select()
    .from(bookingItems)
    .where(eq(bookingItems.bookingId, booking.id))
  return { ...booking, items }
}

export async function cancelMyBooking(id: number) {
  const userId = await getUserId()
  await db
    .update(bookings)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(
      and(
        eq(bookings.id, id),
        eq(bookings.userId, userId),
        inArray(bookings.status, ['pending', 'confirmed']),
      ),
    )
  revalidatePath('/account')
  revalidatePath('/admin')
}
