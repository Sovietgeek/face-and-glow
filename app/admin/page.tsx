import { getAdminStats, getAllBookings } from '@/app/actions/admin'
import { StatsCards } from '@/components/admin/stats-cards'
import { RevenueCharts } from '@/components/admin/revenue-charts'
import { TodaySchedule } from '@/components/admin/today-schedule'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const today = new Date().toISOString().slice(0, 10)
  const [stats, todayBookings] = await Promise.all([
    getAdminStats(),
    getAllBookings({ date: today }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Business overview for Face and Glow
        </p>
      </div>

      <StatsCards
        todayCount={stats.todayCount}
        todayRevenue={stats.todayRevenue}
        pendingCount={stats.pendingCount}
        totalCustomers={stats.totalCustomers}
        completedRevenue={stats.completedRevenue}
      />

      <RevenueCharts
        weekSeries={stats.weekSeries}
        monthSeries={stats.monthSeries}
      />

      <TodaySchedule bookings={todayBookings} />
    </div>
  )
}
