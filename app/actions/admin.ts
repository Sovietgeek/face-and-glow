'use server'

import { requireAdmin } from '@/lib/session'
import { db } from '@/lib/db'
import { bookings, bookingItems, reviews, services, user } from '@/lib/db/schema'
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// --- Dashboard stats ---------------------------------------------------------

export async function getAdminStats() {
  await requireAdmin()

  const today = new Date().toISOString().slice(0, 10)

  const [
    todayBookings,
    pendingCount,
    totalCustomers,
    revenueRows,
    weekRows,
    monthRows,
  ] = await Promise.all([
    db.select().from(bookings).where(eq(bookings.bookingDate, today)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookings)
      .where(eq(bookings.status, 'pending')),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(eq(user.role, 'user')),
    db
      .select({
        total: sql<number>`coalesce(sum("totalAmount"),0)::int`,
      })
      .from(bookings)
      .where(eq(bookings.status, 'completed')),
    db
      .select({
        date: bookings.bookingDate,
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum("totalAmount"),0)::int`,
      })
      .from(bookings)
      .where(
        gte(
          bookings.bookingDate,
          new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
        ),
      )
      .groupBy(bookings.bookingDate)
      .orderBy(bookings.bookingDate),
    db
      .select({
        date: bookings.bookingDate,
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum("totalAmount"),0)::int`,
      })
      .from(bookings)
      .where(
        gte(
          bookings.bookingDate,
          new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
        ),
      )
      .groupBy(bookings.bookingDate)
      .orderBy(bookings.bookingDate),
  ])

  return {
    todayCount: todayBookings.length,
    todayRevenue: todayBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + b.totalAmount, 0),
    pendingCount: pendingCount[0]?.count ?? 0,
    totalCustomers: totalCustomers[0]?.count ?? 0,
    completedRevenue: revenueRows[0]?.total ?? 0,
    weekSeries: weekRows,
    monthSeries: monthRows,
  }
}

// --- Bookings management -----------------------------------------------------

export async function getAllBookings(filter?: {
  status?: string
  date?: string
}) {
  await requireAdmin()

  const conditions = []
  if (filter?.status && filter.status !== 'all')
    conditions.push(eq(bookings.status, filter.status))
  if (filter?.date) conditions.push(eq(bookings.bookingDate, filter.date))

  const rows = await db
    .select()
    .from(bookings)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(bookings.bookingDate), desc(bookings.createdAt))
    .limit(200)

  const ids = rows.map((r) => r.id)
  const items = ids.length
    ? await db
        .select()
        .from(bookingItems)
        .where(inArray(bookingItems.bookingId, ids))
    : []

  return rows.map((b) => ({
    ...b,
    items: items.filter((i) => i.bookingId === b.id),
  }))
}

export async function updateBookingStatus(id: number, status: string) {
  await requireAdmin()
  const allowed = [
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
  ]
  if (!allowed.includes(status)) throw new Error('Invalid status')

  await db
    .update(bookings)
    .set({
      status,
      updatedAt: new Date(),
      ...(status === 'completed' ? { paymentStatus: 'paid' } : {}),
    })
    .where(eq(bookings.id, id))
  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
  revalidatePath('/account')
}

export async function updatePaymentStatus(id: number, paymentStatus: string) {
  await requireAdmin()
  if (!['paid', 'unpaid'].includes(paymentStatus))
    throw new Error('Invalid payment status')
  await db
    .update(bookings)
    .set({ paymentStatus, updatedAt: new Date() })
    .where(eq(bookings.id, id))
  revalidatePath('/admin/bookings')
}

// --- Services management -----------------------------------------------------

export async function getAllServicesAdmin() {
  await requireAdmin()
  return db.select().from(services).orderBy(services.category, services.name)
}

export async function upsertService(data: {
  id?: number
  name: string
  category: string
  description: string
  price: number
  durationMinutes: number
  isActive: boolean
  isFeatured: boolean
}) {
  await requireAdmin()
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  if (data.id) {
    await db
      .update(services)
      .set({
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      })
      .where(eq(services.id, data.id))
  } else {
    await db.insert(services).values({
      name: data.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      category: data.category,
      description: data.description,
      price: data.price,
      durationMinutes: data.durationMinutes,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
    })
  }
  revalidatePath('/admin/services')
  revalidatePath('/services')
  revalidatePath('/')
}

export async function toggleServiceActive(id: number, isActive: boolean) {
  await requireAdmin()
  await db.update(services).set({ isActive }).where(eq(services.id, id))
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

// --- Customers ----------------------------------------------------------------

export async function getAllCustomers() {
  await requireAdmin()
  const customers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      bookingCount: sql<number>`(select count(*)::int from bookings where bookings."userId" = "user".id)`,
      totalSpent: sql<number>`(select coalesce(sum("totalAmount"),0)::int from bookings where bookings."userId" = "user".id and bookings.status = 'completed')`,
    })
    .from(user)
    .where(eq(user.role, 'user'))
    .orderBy(desc(user.createdAt))
  return customers
}

// --- Reviews moderation --------------------------------------------------------

export async function getAllReviewsAdmin() {
  await requireAdmin()
  return db.select().from(reviews).orderBy(desc(reviews.createdAt))
}

export async function setReviewApproval(id: number, isApproved: boolean) {
  await requireAdmin()
  await db.update(reviews).set({ isApproved }).where(eq(reviews.id, id))
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
  revalidatePath('/')
}

export async function deleteReview(id: number) {
  await requireAdmin()
  await db.delete(reviews).where(eq(reviews.id, id))
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
}
