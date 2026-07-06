'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentStatus } from '@/app/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PaymentToggle({
  id,
  paymentStatus,
}: {
  id: number
  paymentStatus: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const paid = paymentStatus === 'paid'

  function toggle() {
    startTransition(async () => {
      await updatePaymentStatus(id, paid ? 'unpaid' : 'paid')
      router.refresh()
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={`Mark as ${paid ? 'unpaid' : 'paid'}`}
      className="cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Badge
          variant="secondary"
          className={cn(
            paid
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200',
          )}
        >
          {paid ? 'Paid' : 'Unpaid'}
        </Badge>
      )}
    </button>
  )
}
