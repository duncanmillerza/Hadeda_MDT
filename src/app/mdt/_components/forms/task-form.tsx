'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Patient, Task } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { createTask, updateTask } from '@/app/actions/tasks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { taskSchema } from '@/lib/validations/task'

const baseSchema = taskSchema.omit({ dueDate: true }).extend({
  id: z.string().uuid().optional(),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof baseSchema>

interface TaskFormProps {
  patient?: Patient | null
  meetingItemId?: string | null
  initialTask?: Task | null
  assignedUsers?: { id: string; name: string | null }[]
  trigger: React.ReactNode
}

export function TaskForm({
  patient,
  meetingItemId,
  initialTask,
  assignedUsers = [],
  trigger,
}: TaskFormProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(baseSchema) as Resolver<TaskFormValues>,
    defaultValues: {
      id: initialTask?.id,
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      priority: initialTask?.priority ?? 'MEDIUM',
      status: initialTask?.status ?? 'OPEN',
      dueDate: initialTask?.dueDate ? initialTask.dueDate.toISOString().slice(0, 10) : undefined,
      patientId: initialTask?.patientId ?? patient?.id ?? undefined,
      meetingItemId: initialTask?.meetingItemId ?? meetingItemId ?? undefined,
      assignedToId: initialTask?.assignedToId ?? undefined,
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true)
    try {
      const { id, dueDate, ...rest } = values
      const payload = {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      }

      if (id) {
        await updateTask(id, payload)
        toast.success('Task updated')
      } else {
        await createTask(payload)
        toast.success('Task created')
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTask ? 'Edit task' : 'Create task'}</DialogTitle>
          <DialogDescription>
            Capture action items for this patient and keep the MDT team aligned.
          </DialogDescription>
        </DialogHeader>
        <Form {...(form as any)}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Follow up with patient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Add context or instructions"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                          <SelectItem value="DONE">Done</SelectItem>
                          <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned to</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? 'unassigned'}
                        onValueChange={value =>
                          field.onChange(value === 'unassigned' ? undefined : value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {assignedUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name ?? 'Unknown user'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date</FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value ?? ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialTask ? (
                  'Save changes'
                ) : (
                  'Create task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
