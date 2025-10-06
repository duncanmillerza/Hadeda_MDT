'use client'

import * as React from 'react'

import type { ClinicianAllowlist } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import {
  createAllowlistEntry,
  deleteAllowlistEntry,
  updateAllowlistEntry,
} from '@/app/actions/allowlist'
import { allowlistSchema } from '@/lib/validations/allowlist'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface AllowlistTableProps {
  entries: ClinicianAllowlist[]
}

const formSchema = z.object({
  id: z.string().uuid().optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Valid email required')
    .transform(v => v.toLowerCase().trim()),
  name: z.string().max(100).optional(),
  discipline: z.string().max(100).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CLINICIAN', 'VIEWER']),
})

type AllowlistFormValues = z.infer<typeof formSchema>

export function AllowlistTable({ entries }: AllowlistTableProps) {
  const [open, setOpen] = React.useState(false)
  const [editingEntry, setEditingEntry] = React.useState<ClinicianAllowlist | null>(null)
  const router = useRouter()

  const form = useForm<AllowlistFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      email: '',
      name: '',
      discipline: '',
      role: 'CLINICIAN',
    },
  })

  const handleAdd = () => {
    setEditingEntry(null)
    form.reset({ email: '', name: '', discipline: '', role: 'CLINICIAN' })
    setOpen(true)
  }

  const handleEdit = (entry: ClinicianAllowlist) => {
    setEditingEntry(entry)
    form.reset({
      id: entry.id,
      email: entry.email,
      name: entry.name ?? '',
      discipline: entry.discipline ?? '',
      role: entry.role,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAllowlistEntry(id)
      toast.success('Removed from allowlist')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove entry')
    }
  }

  const onSubmit = async (values: AllowlistFormValues) => {
    try {
      const payload = {
        email: values.email,
        name: values.name?.trim() || undefined,
        discipline: values.discipline?.trim() || undefined,
        role: values.role,
      }
      if (values.id) {
        await updateAllowlistEntry(values.id, payload)
        toast.success('Allowlist entry updated')
      } else {
        await createAllowlistEntry(payload)
        toast.success('Allowlist entry created')
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save allowlist entry')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {entries.length} authorized email{entries.length === 1 ? '' : 's'}
        </p>
        <Button size="sm" onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add clinician
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length ? (
              entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.name ?? '—'}</TableCell>
                  <TableCell>{entry.discipline ?? '—'}</TableCell>
                  <TableCell>{entry.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No authorized clinicians yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit clinician access' : 'Add clinician access'}</DialogTitle>
            <DialogDescription>
              Only clinicians listed here can authenticate with Google and access the MDT platform.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="clinician@hadedahealth.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discipline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discipline</FormLabel>
                      <FormControl>
                        <Input placeholder="Physiotherapy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="CLINICIAN">Clinician</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? 'Save changes' : 'Add clinician'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
