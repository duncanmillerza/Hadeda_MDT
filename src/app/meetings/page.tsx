import Link from 'next/link'

import { getMeetings } from '@/app/actions/meetings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const metadata = {
  title: 'Meetings • HadedaHealth MDT',
}

export default async function MeetingsPage() {
  const meetings = await getMeetings()

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">MDT Meetings</h1>
          <p className="text-sm text-muted-foreground">
            Review upcoming and past meetings, or create a new agenda.
          </p>
        </div>
        <Button variant="secondary" disabled>
          Create meeting (coming soon)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {meetings.length ? (
          meetings.map(meeting => (
            <Card key={meeting.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-semibold">
                  <span>{meeting.title}</span>
                  <Badge variant="outline">{meeting._count.items} patients</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {format(meeting.date, 'EEEE, d MMM yyyy')}
                  </p>
                  {meeting.location ? (
                    <p>Location: {meeting.location}</p>
                  ) : null}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/meetings/${meeting.id}`}>View agenda</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No meetings scheduled yet. Use the create action above to plan your
              first MDT session.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
