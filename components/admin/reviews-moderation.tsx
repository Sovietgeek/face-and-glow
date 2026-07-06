'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setReviewApproval, deleteReview } from '@/app/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/star-rating'
import { Check, Trash2, EyeOff } from 'lucide-react'

type Review = {
  id: number
  customerName: string
  rating: number
  comment: string
  serviceName: string | null
  isApproved: boolean
  createdAt: Date
}

export function ReviewsModeration({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function approve(id: number, isApproved: boolean) {
    startTransition(async () => {
      await setReviewApproval(id, isApproved)
      router.refresh()
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteReview(id)
      router.refresh()
    })
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No reviews submitted yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((r) => (
        <Card key={r.id} className={!r.isApproved ? 'border-amber-300' : ''}>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{r.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {r.serviceName ?? 'General'} ·{' '}
                  {new Date(r.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <Badge variant={r.isApproved ? 'default' : 'secondary'}>
                {r.isApproved ? 'Live' : 'Pending'}
              </Badge>
            </div>
            <StarRating rating={r.rating} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {r.comment}
            </p>
            <div className="flex gap-2">
              {r.isApproved ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => approve(r.id, false)}
                >
                  <EyeOff className="mr-1 h-3.5 w-3.5" /> Hide
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => approve(r.id, true)}
                >
                  <Check className="mr-1 h-3.5 w-3.5" /> Approve
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => remove(r.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
