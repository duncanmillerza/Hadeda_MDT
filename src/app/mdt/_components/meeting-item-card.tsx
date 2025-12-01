'use client'

import * as React from 'react'

import type { AgendaStatus, MDTMeetingItem, Note, Task } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  updateMeetingItemOutcome,
  updateMeetingItemStatus,
} from '@/app/actions/meetings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface MeetingItemCardProps {
  item: MDTMeetingItem & {
    notes: (Note & { author: { name: string | null } })[]
    tasks: (Task & { assignedTo: { name: string | null } | null })[]
    patient: {
      fullName: string
      disciplines: string[]
    }
  }
}

const statusStyles: Record<AgendaStatus, string> = {
  TO_DISCUSS: 'bg-blue-100 text-blue-700 border-blue-200',
  DISCUSSED: 'bg-green-100 text-green-700 border-green-200',
  DEFERRED: 'bg-amber-100 text-amber-700 border-amber-200',
}

export function MeetingItemCard({ item }: MeetingItemCardProps) {
  const [outcome, setOutcome] = React.useState(item.outcome ?? '')
  const [isSavingOutcome, setIsSavingOutcome] = React.useState(false)
  const [isUpdatingStatus, startTransition] = React.useTransition()
  const router = useRouter()

  const handleStatusChange = (status: AgendaStatus) => {
    if (status === item.status) return

    startTransition(async () => {
      try {
        await updateMeetingItemStatus(item.id, status)
        toast.success('Agenda status updated')
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error('Failed to update status')
      }
    })
  }

  const handleOutcomeSave = async () => {
    setIsSavingOutcome(true)
    try {
      await updateMeetingItemOutcome(item.id, outcome)
      toast.success('Outcome saved')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save outcome')
    } finally {
      setIsSavingOutcome(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            {item.patient.fullName}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(item.createdAt, 'PPpp')}</span>
            <Badge className={cn('border', statusStyles[item.status])}>
              {item.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isUpdatingStatus}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Change agenda status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleStatusChange('TO_DISCUSS')}>
              To Discuss
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleStatusChange('DISCUSSED')}>
              Discussed
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleStatusChange('DEFERRED')}>
              Deferred
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <Label htmlFor={`outcome-${item.id}`}>Outcome</Label>
          <Textarea
            id={`outcome-${item.id}`}
            value={outcome}
            onChange={event => setOutcome(event.target.value)}
            placeholder="Summarise the MDT outcome for this patient"
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleOutcomeSave} disabled={isSavingOutcome}>
              {isSavingOutcome ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save outcome'
              )}
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Notes</Label>
            <Badge variant="outline">{item.notes.length}</Badge>
          </div>
          {item.notes.length ? (
            <div className="space-y-2">
              {item.notes.map(note => (
                <div key={note.id} className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.author?.name ?? 'Unknown author'}</span>
                    <span>{format(note.createdAt, 'PPp')}</span>
                  </div>
                  <p className="whitespace-pre-line text-sm text-foreground">{note.body}</p>
                  <Badge variant="secondary" className="mt-2 text-xs uppercase tracking-wide">
                    {note.category.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No notes captured yet.</p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Tasks</Label>
            <Badge variant="outline">{item.tasks.length}</Badge>
          </div>
          {item.tasks.length ? (
            <div className="space-y-2 text-sm">
              {item.tasks.map(task => (
                <div key={task.id} className="rounded-md border border-border/60 bg-muted/30 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{task.title}</span>
                    <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                  </div>
                  {task.description ? (
                    <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                      {task.description}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Priority: {task.priority}</span>
                    {task.dueDate ? <span>Due {format(task.dueDate, 'PP')}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tasks linked yet.</p>
          )}
        </section>
      </CardContent>
    </Card>
  )
}
