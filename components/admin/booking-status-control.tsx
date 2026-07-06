'use client'

import { useState, useTransition } from 'react'
import { updateBookingStatus } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STATUS_LABELS, BOOKING_STATUSES } from '@/lib/constants'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BookingStatusControl({
  id,
  status,
}: {
  id: number
  status: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleChange(next: string) {
    if (next === status) return
    setError(null)
    startTransition(async () => {
      try {
        await updateBookingStatus(id, next)
        router.refresh()
      } catch {
        setError('Failed to update')
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" disabled={isPending} />}>
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              Update <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {BOOKING_STATUSES.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => handleChange(s)}
              disabled={s === status}
            >
              {STATUS_LABELS[s]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
