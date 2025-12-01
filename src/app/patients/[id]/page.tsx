import { notFound } from 'next/navigation'

import { getPatient } from '@/app/actions/patients'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { format } from 'date-fns'

import { TaskTable } from '@/app/tasks/_components/task-table'
import { TaskForm } from '@/app/mdt/_components/forms/task-form'
import { NoteForm } from '@/app/mdt/_components/forms/note-form'

type PatientParams = Promise<{ id: string }>

export default async function PatientDetailPage({ params }: { params: PatientParams }) {
  const { id } = await params
  const patient = await getPatient(id)
  if (!patient) {
    notFound()
  }

  const disciplines = (patient.disciplines ?? []).filter(Boolean)

  return (
    <div className="container space-y-6 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/patients">← Back to patients</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{patient.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Status: {patient.status}</Badge>
            {patient.diagnosis ? <Badge variant="secondary">{patient.diagnosis}</Badge> : null}
            {patient.medicalAid ? <Badge>{patient.medicalAid}</Badge> : null}
          </div>
          {disciplines.length ? (
            <div className="flex flex-wrap gap-2">
              {disciplines.map((discipline, index) => (
                <Badge key={`${discipline}-${index}`} variant="secondary">
                  {discipline}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Notes ({patient.notes.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({patient.tasks.length})</TabsTrigger>
          <TabsTrigger value="meetings">Meetings ({patient.meetingItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-end">
            <NoteForm
              patientId={patient.id}
              trigger={<Button size="sm">Add note</Button>}
            />
          </div>
          {patient.notes.length ? (
            <div className="space-y-3">
              {patient.notes.map(note => (
                <Card key={note.id} className="border-border/60">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.author?.name ?? 'Unknown author'}</span>
                      <span>{format(note.createdAt, 'PPp')}</span>
                    </div>
                    <CardTitle className="text-sm font-semibold">
                      {note.category.replace('_', ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-foreground whitespace-pre-line">
                    {note.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No notes captured yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-end">
            <TaskForm
              patient={patient as any}
              trigger={<Button size="sm">Create task</Button>}
            />
          </div>
          {patient.tasks.length ? (
            <TaskTable data={patient.tasks as any} searchPlaceholder="Search patient tasks…" />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No tasks linked to this patient yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          {patient.meetingItems.length ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              {patient.meetingItems.map(item => (
                <Card key={item.id} className="border-border/60">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base font-semibold text-foreground">
                      {item.meeting?.title ?? 'Meeting'}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {item.meeting ? (
                        <Badge variant="outline">{format(item.meeting.date, 'PP')}</Badge>
                      ) : null}
                      <Badge variant="secondary">{item.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {item.summary ? (
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    ) : null}
                    {item.meeting ? (
                      <Button asChild variant="ghost" size="sm" className="px-0">
                        <Link href={`/meetings/${item.meeting.id}`}>View meeting</Link>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                This patient has not been discussed in any meetings yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
