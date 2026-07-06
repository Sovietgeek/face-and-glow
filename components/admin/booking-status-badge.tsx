import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  in_progress: 'bg-primary/15 text-primary hover:bg-primary/15',
  completed: 'bg-green-100 text-green-800 hover:bg-green-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn('font-medium', styles[status] ?? '')}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
