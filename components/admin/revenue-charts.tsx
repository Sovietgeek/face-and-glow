'use client'

import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type SeriesPoint = { date: string; count: number; revenue: number }

const chartConfig = {
  revenue: { label: 'Booked Value (₹)', color: 'var(--chart-1)' },
  count: { label: 'Bookings', color: 'var(--chart-2)' },
}

function fillSeries(series: SeriesPoint[], days: number): SeriesPoint[] {
  const map = new Map(series.map((p) => [p.date, p]))
  const out: SeriesPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    out.push(map.get(d) ?? { date: d, count: 0, revenue: 0 })
  }
  return out
}

function formatDay(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

export function RevenueCharts({
  weekSeries,
  monthSeries,
}: {
  weekSeries: SeriesPoint[]
  monthSeries: SeriesPoint[]
}) {
  const [range, setRange] = useState<'week' | 'month'>('week')

  const data = useMemo(() => {
    const filled =
      range === 'week' ? fillSeries(weekSeries, 7) : fillSeries(monthSeries, 30)
    return filled.map((p) => ({ ...p, label: formatDay(p.date) }))
  }, [range, weekSeries, monthSeries])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-serif">Bookings & Revenue</CardTitle>
          <CardDescription>
            {range === 'week' ? 'Last 7 days' : 'Last 30 days'} performance
          </CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as 'week' | 'month')}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full md:h-80">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={range === 'week' ? 0 : 4}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} width={60} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
