'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
]

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {links.map((link) => {
        const Icon = link.icon
        const active =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Face and Glow logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-serif text-lg font-semibold">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 bg-card pt-16 md:hidden">
          {nav}
          <div className="mt-4 border-t px-3 pt-4 flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              <Home className="h-4 w-4" /> View Website
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary text-left"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Image
            src="/images/logo.png"
            alt="Face and Glow logo"
            width={34}
            height={34}
            className="rounded-full"
          />
          <div>
            <p className="font-serif text-base font-semibold leading-tight">
              Face and Glow
            </p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        {nav}
        <div className="mt-auto border-t px-3 py-4">
          <p className="px-3 pb-2 text-xs text-muted-foreground">
            Signed in as {userName}
          </p>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            <Home className="h-4 w-4" /> View Website
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary text-left"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
