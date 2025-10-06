import { getMeetings } from '@/app/actions/meetings'
import { getPatients } from '@/app/actions/patients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatientTable } from './_components/patient-table'
import type { PatientRow } from './_components/patient-table'
import type { MeetingOption } from './_components/patient-row-actions'

const tabs = [
  { key: 'ACTIVE', label: 'Active' },
  { key: 'WAITING_AUTH', label: 'Waiting Auth' },
  { key: 'HEADWAY', label: 'Headway' },
  { key: 'DISCHARGED', label: 'Discharged' },
] as const

export default async function MDTPage() {
  const [active, waiting, headway, discharged, meetings] = await Promise.all([
    getPatients('ACTIVE'),
    getPatients('WAITING_AUTH'),
    getPatients('HEADWAY'),
    getPatients('DISCHARGED'),
    getMeetings(),
  ])

  const dataMap: Record<(typeof tabs)[number]['key'], PatientRow[]> = {
    ACTIVE: active,
    WAITING_AUTH: waiting,
    HEADWAY: headway,
    DISCHARGED: discharged,
  }

  const meetingOptions: MeetingOption[] = meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    date: meeting.date.toISOString(),
  }))

  return (
    <div className="container space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">MDT Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ACTIVE">
            <TabsList className="flex-wrap">
              {tabs.map(tab => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label} ({dataMap[tab.key].length})
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.key} value={tab.key} className="mt-6">
                <PatientTable
                  data={dataMap[tab.key]}
                  meetings={meetingOptions}
                  searchPlaceholder={`Search ${tab.label.toLowerCase()} patients…`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
