import type { Metadata } from 'next'
import { getServices } from '@/app/actions/services'
import { ServicesCatalog } from '@/components/services-catalog'

export const metadata: Metadata = {
  title: 'Services & Price List',
  description:
    'Browse all Face and Glow beauty services — hair, facials, makeup, mehndi, nails, waxing, spa and bridal packages with transparent prices.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-5xl">
          Services & Prices
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground text-pretty">
          Transparent pricing, premium products, expert hands. Add services to
          your cart and book a slot that works for you.
        </p>
      </div>
      <ServicesCatalog services={services} />
    </div>
  )
}
