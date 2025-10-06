import { notFound } from 'next/navigation'

import { getMeeting } from '@/app/actions/meetings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MeetingItemCard } from '@/app/mdt/_components/meeting-item-card'
import { TaskForm } from '@/app/mdt/_components/forms/task-form'
import { NoteForm } from '@/app/mdt/_components/forms/note-form'
import { format } from 'date-fns'
import Link from 'next/link'

interface MeetingDetailPageProps {
  params: {
    id: string
  }
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const meeting = await getMeeting(params.id)
  if (!meeting) {
    notFound()
  }

  return (
    <div className="container space-y-6 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/meetings">← Back to meetings</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {meeting.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">{format(meeting.date, 'PPP')}</Badge>
          {meeting.location ? (
            <Badge variant="secondary">{meeting.location}</Badge>
          ) : null}
          <Badge variant="outline">{meeting.items.length} agenda items</Badge>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {meeting.items.length ? (
          meeting.items.map(item => (
            <div key={item.id} className="space-y-4">
              <MeetingItemCard item={item} />
              <div className="flex flex-wrap gap-2">
                <TaskForm
                  patient={item.patient}
                  initialTask={null}
                  trigger={<Button variant="outline" size="sm">Add task</Button>}
                />
                <NoteForm
                  patientId={item.patientId}
                  meetingItemId={item.id}
                  trigger={<Button variant="ghost" size="sm">Add note</Button>}
                />
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No patients have been added to this meeting yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
