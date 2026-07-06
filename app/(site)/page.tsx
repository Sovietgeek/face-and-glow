import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServiceCard } from '@/components/service-card'
import { ReviewCard } from '@/components/review-card'
import { getFeaturedServices, getApprovedReviews } from '@/app/actions/services'
import { CATEGORIES, SALON_INFO } from '@/lib/constants'

export default async function HomePage() {
  const [featured, allReviews] = await Promise.all([
    getFeaturedServices(),
    getApprovedReviews(),
  ])
  const reviews = allReviews.slice(0, 6)
  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '5.0'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div className="flex flex-col items-start gap-6">
            <span className="flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Rated {avgRating}/5 by our lovely customers
            </span>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground text-balance md:text-6xl">
              Where Beauty Meets <span className="text-primary">Elegance</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
              Welcome to {SALON_INFO.name} — your destination for premium hair,
              skin, makeup, mehndi and bridal services. Book your appointment
              online in under a minute.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/services" />} size="lg">
                Book Appointment
                <ArrowRight className="size-4" />
              </Button>
              <Button render={<Link href="/services" />} size="lg" variant="outline">
                Explore Services
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-primary" />
                Instant Online Booking
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Certified Beauticians
              </span>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero.png"
              alt="Face and Glow luxury salon interior"
              width={640}
              height={480}
              priority
              className="w-full rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary py-14 md:py-18">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Our Services
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground text-pretty">
              From everyday grooming to your big day — we have everything you
              need under one roof.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Image
                  src={cat.image || '/placeholder.svg'}
                  alt={cat.name}
                  width={320}
                  height={240}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent p-3">
                  <span className="font-serif text-base font-semibold text-background md:text-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="py-14 md:py-18">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
                Popular Picks
              </h2>
              <p className="text-sm text-muted-foreground">
                Our most loved services, at prices you&apos;ll love too.
              </p>
            </div>
            <Button
              render={<Link href="/services" />}
              variant="outline"
              className="hidden md:inline-flex"
            >
              View All
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <Button render={<Link href="/services" />} variant="outline" className="md:hidden">
            View All Services
          </Button>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-secondary py-14 md:py-18">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-sm text-muted-foreground">
              Real reviews from real customers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button render={<Link href="/reviews" />} variant="outline">
              Read All Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-12 text-center md:py-16">
            <h2 className="font-serif text-3xl font-semibold text-primary-foreground text-balance md:text-4xl">
              Ready for Your Glow-Up?
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/85 text-pretty">
              Pick your services, choose a time slot that suits you, and walk in
              to a pampering experience. Pay at the salon after your service.
            </p>
            <Button render={<Link href="/services" />} size="lg" variant="secondary">
              Book Your Appointment
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
