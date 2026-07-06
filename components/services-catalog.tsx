'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServiceCard, type ServiceData } from '@/components/service-card'
import { useCart } from '@/lib/cart-context'
import { CATEGORIES, formatINR } from '@/lib/constants'
import { cn } from '@/lib/utils'

function CatalogInner({ services }: { services: ServiceData[] }) {
  const searchParams = useSearchParams()
  const initial = searchParams.get('category')
  const [category, setCategory] = useState<string>(
    initial && CATEGORIES.some((c) => c.name === initial) ? initial : 'All',
  )
  const { items, total } = useCart()

  const filtered = useMemo(
    () => (category === 'All' ? services : services.filter((s) => s.category === category)),
    [services, category],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Service categories">
        {['All', ...CATEGORIES.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              category === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No services found in this category.
        </p>
      )}

      {items.length > 0 && (
        <div className="sticky bottom-4 z-40 mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {items.length} service{items.length > 1 ? 's' : ''} selected
              </span>
              <span className="text-xs text-muted-foreground">{formatINR(total)}</span>
            </div>
          </div>
          <Button render={<Link href="/cart" />} size="sm">
            View Cart
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function ServicesCatalog({ services }: { services: ServiceData[] }) {
  return (
    <Suspense fallback={null}>
      <CatalogInner services={services} />
    </Suspense>
  )
}
