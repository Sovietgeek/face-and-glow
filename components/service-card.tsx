'use client'

import { Clock, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import { formatINR } from '@/lib/constants'

export type ServiceData = {
  id: number
  name: string
  category: string
  description: string
  price: number
  durationMinutes: number
  isFeatured?: boolean
}

export function ServiceCard({ service }: { service: ServiceData }) {
  const { addItem, removeItem, isInCart } = useCart()
  const inCart = isInCart(service.id)

  return (
    <Card className="group flex h-full flex-col border-border transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="w-fit text-xs">
              {service.category}
            </Badge>
            <h3 className="font-serif text-lg font-semibold leading-snug text-foreground text-pretty">
              {service.name}
            </h3>
          </div>
          <p className="shrink-0 text-lg font-semibold text-primary">
            {formatINR(service.price)}
          </p>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {service.durationMinutes} min
          </span>
          <Button
            size="sm"
            variant={inCart ? 'secondary' : 'default'}
            onClick={() =>
              inCart
                ? removeItem(service.id)
                : addItem({
                    id: service.id,
                    name: service.name,
                    category: service.category,
                    price: service.price,
                    durationMinutes: service.durationMinutes,
                  })
            }
          >
            {inCart ? (
              <>
                <Check className="size-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
