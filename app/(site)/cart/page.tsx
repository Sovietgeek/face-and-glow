import type { Metadata } from 'next'
import { CartView } from '@/components/cart-view'

export const metadata: Metadata = { title: 'Your Cart' }

export default function CartPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-center font-serif text-3xl font-semibold text-foreground md:text-4xl">
        Your Cart
      </h1>
      <CartView />
    </div>
  )
}
