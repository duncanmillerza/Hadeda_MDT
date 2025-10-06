import Link from 'next/link'

import { getPatients } from '@/app/actions/patients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { PatientRow } from '../mdt/_components/patient-table'
import { PatientTable } from '../mdt/_components/patient-table'

const tabs = [
  { key: 'ACTIVE', label: 'Active' },
  { key: 'WAITING_AUTH', label: 'Waiting Auth' },
  { key: 'HEADWAY', label: 'Headway' },
  { key: 'DISCHARGED', label: 'Discharged' },
] as const

export default async function PatientsPage() {
  const [active, waiting, headway, discharged] = await Promise.all([
    getPatients('ACTIVE'),
    getPatients('WAITING_AUTH'),
    getPatients('HEADWAY'),
    getPatients('DISCHARGED'),
  ])

  const dataMap: Record<(typeof tabs)[number]['key'], PatientRow[]> = {
    ACTIVE: active,
    WAITING_AUTH: waiting,
    HEADWAY: headway,
    DISCHARGED: discharged,
  }

  const totalCount = active.length + waiting.length + headway.length + discharged.length

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Browse all patients by status and open individual records for notes,
            tasks, and meeting history.
          </p>
        </div>
        <Badge variant="outline">Total {totalCount}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cohorts</CardTitle>
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
                  meetings={[]}
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
