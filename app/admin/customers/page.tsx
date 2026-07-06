import { getAllCustomers } from '@/app/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatINR } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Customers
        </h1>
        <p className="text-sm text-muted-foreground">
          All registered customers with booking history and spend
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {customers.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No customers have signed up yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.phone ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.bookingCount}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatINR(c.totalSpent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
