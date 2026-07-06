import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from '@/components/star-rating'

export type ReviewData = {
  id: number
  customerName: string
  rating: number
  comment: string
  serviceName: string | null
  createdAt: Date | string
}

export function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <Card className="h-full border-border">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <StarRating rating={review.rating} />
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{review.comment}&rdquo;
        </p>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">{review.customerName}</p>
          {review.serviceName && (
            <p className="text-xs text-muted-foreground">{review.serviceName}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
