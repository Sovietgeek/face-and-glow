import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { SALON_INFO } from '@/lib/constants'

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Face and Glow logo"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            <span className="font-serif text-xl font-semibold text-foreground">
              Face <span className="text-primary">&</span> Glow
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {SALON_INFO.tagline}. Premium beauty services for every occasion —
            book your appointment online in seconds.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-lg font-semibold text-foreground">Quick Links</h3>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
              All Services
            </Link>
            <Link href="/booking" className="text-sm text-muted-foreground hover:text-primary">
              Book Appointment
            </Link>
            <Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary">
              Customer Reviews
            </Link>
            <Link href="/account" className="text-sm text-muted-foreground hover:text-primary">
              My Bookings
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-lg font-semibold text-foreground">Visit Us</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {SALON_INFO.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              {SALON_INFO.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              {SALON_INFO.email}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" />
              {SALON_INFO.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        {'© '}
        {new Date().getFullYear()} Face and Glow. All rights reserved.
      </div>
    </footer>
  )
}
