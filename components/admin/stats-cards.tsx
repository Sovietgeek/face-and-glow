import { Card, CardContent } from '@/components/ui/card'
import { formatINR } from '@/lib/constants'
import {
  CalendarCheck,
  Clock,
  IndianRupee,
  Users,
  TrendingUp,
} from 'lucide-react'

export function StatsCards({
  todayCount,
  todayRevenue,
  pendingCount,
  totalCustomers,
  completedRevenue,
}: {
  todayCount: number
  todayRevenue: number
  pendingCount: number
  totalCustomers: number
  completedRevenue: number
}) {
  const stats = [
    {
      label: "Today's Appointments",
      value: String(todayCount),
      icon: CalendarCheck,
    },
    {
      label: "Today's Booked Value",
      value: formatINR(todayRevenue),
      icon: IndianRupee,
    },
    {
      label: 'Pending Confirmations',
      value: String(pendingCount),
      icon: Clock,
      alert: pendingCount > 0,
    },
    { label: 'Total Customers', value: String(totalCustomers), icon: Users },
    {
      label: 'Total Revenue (Completed)',
      value: formatINR(completedRevenue),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 md:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className={stat.alert ? 'border-primary' : ''}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground text-pretty">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-primary" />
              </div>
              <span className="text-xl font-semibold md:text-2xl">
                {stat.value}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
