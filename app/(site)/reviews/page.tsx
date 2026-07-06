import type { Metadata } from 'next'
import { getApprovedReviews } from '@/app/actions/services'
import { getSession } from '@/lib/session'
import { ReviewCard } from '@/components/review-card'
import { StarRating } from '@/components/star-rating'
import { ReviewForm } from '@/components/review-form'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description:
    'Read genuine customer reviews of Face and Glow beauty parlour services and share your own experience.',
}

export default async function ReviewsPage() {
  const [reviews, session] = await Promise.all([getApprovedReviews(), getSession()])
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 5

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-5xl">
          Customer Reviews
        </h1>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avg)} size={20} />
          <span className="text-sm text-muted-foreground">
            {avg.toFixed(1)} out of 5 &middot; {reviews.length} review{reviews.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mx-auto w-full max-w-lg">
        <ReviewForm isSignedIn={!!session?.user} />
      </div>
    </div>
  )
}
