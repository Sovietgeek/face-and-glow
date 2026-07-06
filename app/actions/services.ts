'use server'

import { db } from '@/lib/db'
import { services, reviews } from '@/lib/db/schema'
import { asc, desc, eq } from 'drizzle-orm'

export async function getServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(asc(services.category), asc(services.price))
}

export async function getFeaturedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.isFeatured, true))
    .orderBy(asc(services.price))
}

export async function getApprovedReviews() {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.isApproved, true))
    .orderBy(desc(reviews.createdAt))
}
