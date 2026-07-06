'use client'

import Link from 'next/link'
import { Trash2, Clock, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import { formatINR } from '@/lib/constants'

export function CartView() {
  const { items, removeItem, total, totalDuration } = useCart()

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Your cart is empty. Browse our services and add your favourites.
          </p>
          <Button render={<Link href="/services" />}>Browse Services</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          {items.map((item, idx) => (
            <div key={item.id}>
              {idx > 0 && <Separator className="my-3" />}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {item.category}
                    <span aria-hidden>&middot;</span>
                    <Clock className="size-3" />
                    {item.durationMinutes} min
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">
                    {formatINR(item.price)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Duration</span>
            <span>{Math.floor(totalDuration / 60) > 0 ? `${Math.floor(totalDuration / 60)}h ` : ''}{totalDuration % 60}m</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total Amount</span>
            <span className="font-serif text-xl font-semibold text-primary">{formatINR(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Payment: Pay at Salon after your service. No advance required.
          </p>
          <Button render={<Link href="/booking" />} size="lg" className="mt-1">
            Choose Date & Time
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
