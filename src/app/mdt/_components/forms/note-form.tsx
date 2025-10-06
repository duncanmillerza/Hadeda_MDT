'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Note } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { createNote, updateNote } from '@/app/actions/notes'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
const formSchema = z.object({
  id: z.string().uuid().optional(),
  body: z.string().min(1, 'Note content is required').max(5000),
  category: z.enum(['MDT_FEEDBACK', 'DOCTOR', 'PSYCHOLOGY', 'SOCIAL_WORK', 'GENERAL']),
  patientId: z.string().uuid(),
  meetingItemId: z.string().uuid().optional().nullable(),
})

type NoteFormValues = z.infer<typeof formSchema>

interface NoteFormProps {
  patientId: string
  meetingItemId?: string | null
  initialNote?: Note | null
  trigger: React.ReactNode
}

export function NoteForm({ patientId, meetingItemId, initialNote, trigger }: NoteFormProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(formSchema) as Resolver<NoteFormValues>,
    defaultValues: {
      id: initialNote?.id,
      body: initialNote?.body ?? '',
      category: initialNote?.category ?? 'MDT_FEEDBACK',
      patientId,
      meetingItemId: initialNote?.meetingItemId ?? meetingItemId ?? undefined,
    },
  })

  const onSubmit = async (values: NoteFormValues) => {
    setIsSubmitting(true)
    try {
      if (values.id) {
        await updateNote(values.id, {
          body: values.body,
          category: values.category,
        })
        toast.success('Note updated')
      } else {
        await createNote(values)
        toast.success('Note added')
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialNote ? 'Edit note' : 'Add note'}</DialogTitle>
          <DialogDescription>
            Document MDT feedback so the wider care team stays informed.
          </DialogDescription>
        </DialogHeader>
        <Form {...(form as any)}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MDT_FEEDBACK">MDT feedback</SelectItem>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="PSYCHOLOGY">Psychology</SelectItem>
                        <SelectItem value="SOCIAL_WORK">Social Work</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Document MDT feedback..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                ) : initialNote ? (
                  'Save changes'
                ) : (
                  'Add note'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
