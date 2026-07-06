'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertService, toggleServiceActive } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, formatINR } from '@/lib/constants'
import { Loader2, Pencil, Plus } from 'lucide-react'

type Service = {
  id: number
  name: string
  category: string
  description: string
  price: number
  durationMinutes: number
  isActive: boolean
  isFeatured: boolean
}

const emptyForm = {
  name: '',
  category: 'Hair',
  description: '',
  price: 0,
  durationMinutes: 30,
  isActive: true,
  isFeatured: false,
}

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const [isPending, startTransition] = useTransition()

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(service: Service) {
    setEditing(service)
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    })
    setOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await upsertService({
        ...(editing ? { id: editing.id } : {}),
        ...form,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      })
      setOpen(false)
      router.refresh()
    })
  }

  function handleToggle(service: Service) {
    startTransition(async () => {
      await toggleServiceActive(service.id, !service.isActive)
      router.refresh()
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />} onClick={openNew}>
              <Plus className="mr-1 h-4 w-4" /> Add Service
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editing ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="svc-name">Service Name</Label>
                  <Input
                    id="svc-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="svc-desc">Description</Label>
                  <Textarea
                    id="svc-desc"
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="svc-price">Price (₹)</Label>
                    <Input
                      id="svc-price"
                      type="number"
                      min={0}
                      required
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="svc-duration">Duration (min)</Label>
                    <Input
                      id="svc-duration"
                      type="number"
                      min={5}
                      required
                      value={form.durationMinutes}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          durationMinutes: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                      }
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({ ...form, isFeatured: e.target.checked })
                      }
                    />
                    Featured on homepage
                  </label>
                </div>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editing ? (
                    'Save Changes'
                  ) : (
                    'Add Service'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id} className={!s.isActive ? 'opacity-50' : ''}>
                  <TableCell>
                    <p className="font-medium">{s.name}</p>
                    {s.isFeatured && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.category}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatINR(s.price)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {s.durationMinutes} min
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.isActive ? 'default' : 'secondary'}>
                      {s.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        aria-label={`Edit ${s.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggle(s)}
                      >
                        {s.isActive ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
