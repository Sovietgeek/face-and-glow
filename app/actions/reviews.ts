'use server'

import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function submitReview(input: {
  rating: number
  comment: string
  serviceName?: string
}) {
  const session = await getSession()
  if (!session?.user) throw new Error('Please sign in to leave a review')

  const rating = Math.round(input.rating)
  if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5')
  const comment = input.comment.trim()
  if (comment.length < 10) throw new Error('Please write at least 10 characters')
  if (comment.length > 1000) throw new Error('Review is too long')

  await db.insert(reviews).values({
    userId: session.user.id,
    customerName: session.user.name,
    rating,
    comment,
    serviceName: input.serviceName?.trim() || null,
    isApproved: false,
  })

  revalidatePath('/reviews')
  revalidatePath('/admin/reviews')
}
