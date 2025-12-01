'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { createMeeting } from '@/app/actions/meetings'
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
import { meetingSchema } from '@/lib/validations/meeting'

const formSchema = meetingSchema.extend({
  date: z.string().min(1, 'Date is required'),
})

type MeetingFormValues = z.infer<typeof formSchema>

interface MeetingFormProps {
  trigger: React.ReactNode
}

export function MeetingForm({ trigger }: MeetingFormProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: '',
      location: '',
    },
  })

  const onSubmit = (values: MeetingFormValues) => {
    startTransition(async () => {
      try {
        await createMeeting({
          title: values.title,
          date: new Date(values.date),
          location: values.location?.trim() || undefined,
        })
        toast.success('Meeting created')
        setOpen(false)
        router.refresh()
      } catch (error) {
        console.error(error)
        const message = error instanceof Error ? error.message : 'Failed to create meeting'
        toast.error(message === 'Unauthorized' ? 'You need admin access to create meetings.' : message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
          <DialogDescription>
            Plan your next MDT session by setting a title, date, and optional location.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly MDT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Boardroom 3"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create meeting'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
