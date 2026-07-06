import { getAllReviewsAdmin } from '@/app/actions/admin'
import { ReviewsModeration } from '@/components/admin/reviews-moderation'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve or remove customer reviews before they go live
        </p>
      </div>
      <ReviewsModeration reviews={reviews} />
    </div>
  )
}
