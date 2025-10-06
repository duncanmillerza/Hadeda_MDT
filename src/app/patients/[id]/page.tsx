import { notFound } from 'next/navigation'

import { getPatient } from '@/app/actions/patients'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

interface PatientDetailPageProps {
  params: {
    id: string
  }
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const patient = await getPatient(params.id)
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
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card>
            <CardContent className="space-y-4 py-6 text-sm text-muted-foreground">
              <p>Note management UI coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="space-y-4 py-6 text-sm text-muted-foreground">
              <p>Task management UI coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardContent className="space-y-4 py-6 text-sm text-muted-foreground">
              <p>Meeting history UI coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
