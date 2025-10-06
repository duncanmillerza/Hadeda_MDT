'use client'

import * as React from 'react'

import type { Patient } from '@prisma/client'
import { format } from 'date-fns'
import { CalendarPlus, ClipboardPlus, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { addPatientToMeeting } from '@/app/actions/meetings'
import { TaskForm } from './forms/task-form'
import { NoteForm } from './forms/note-form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

export interface MeetingOption {
  id: string
  title: string
  date: string
}

interface PatientRowActionsProps {
  patient: Patient
  meetings: MeetingOption[]
}

export function PatientRowActions({ patient, meetings }: PatientRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedMeeting, setSelectedMeeting] = React.useState<string>('')
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const disciplines = (patient.disciplines ?? []).filter(Boolean)

  const handleAddToMeeting = () => {
    if (!selectedMeeting) {
      toast.error('Select a meeting first')
      return
    }

    startTransition(async () => {
      try {
        await addPatientToMeeting(selectedMeeting, patient.id)
        toast.success(`${patient.fullName} added to meeting`)
        setIsOpen(false)
        setSelectedMeeting('')
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error('Failed to add patient to meeting')
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Discuss
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{patient.fullName}</SheetTitle>
          <SheetDescription>
            Manage discussion context and quick actions for this patient.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div>{patient.diagnosis ?? 'No diagnosis captured'}</div>
          <div className="flex flex-wrap gap-2">
            {disciplines.length ? (
              disciplines.map((discipline, index) => (
                <Badge key={`${discipline}-${index}`} variant="secondary">
                  {discipline}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No disciplines recorded
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Add to meeting</h3>
            {meetings.length ? (
              <div className="flex flex-col gap-3">
                <Select
                  value={selectedMeeting}
                  onValueChange={setSelectedMeeting}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select upcoming meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetings.map(meeting => (
                      <SelectItem key={meeting.id} value={meeting.id}>
                        <div className="flex flex-col">
                          <span>{meeting.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(meeting.date), 'PPpp')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddToMeeting}
                  disabled={isPending}
                  className="gap-2"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Add to meeting
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No meetings scheduled yet. Create one to add this patient to the
                agenda.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <TaskForm
                patient={patient}
                trigger={
                  <Button variant="outline" size="sm" className="justify-start gap-2">
                    <ClipboardPlus className="h-4 w-4" />
                    Create task
                  </Button>
                }
              />
              <NoteForm
                patientId={patient.id}
                trigger={
                  <Button variant="ghost" size="sm" className="justify-start gap-2 px-2">
                    <MessageCircle className="h-4 w-4" />
                    Add note
                  </Button>
                }
              />
              <Button asChild variant="ghost" size="sm" className="justify-start">
                <Link href={`/patients/${patient.id}`}>Open patient record</Link>
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
