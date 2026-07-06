import type React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const current = await getCurrentUser()
  if (!current) redirect('/sign-in')
  if (current.role !== 'admin') redirect('/')

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <AdminSidebar userName={current.name} />
      <main className="flex-1 p-4 md:p-8 md:pl-8 pt-16 md:pt-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
