import { getAllServicesAdmin } from '@/app/actions/admin'
import { ServicesManager } from '@/components/admin/services-manager'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Add, edit, price and enable/disable your service menu
        </p>
      </div>
      <ServicesManager services={services} />
    </div>
  )
}
