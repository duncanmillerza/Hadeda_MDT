'use client'

import * as React from 'react'

import type { Patient } from '@prisma/client'
import type { ColumnDef, Row } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/data-table'
import { disciplinesToArray } from '@/lib/disciplines-helper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientRowActions, type MeetingOption } from './patient-row-actions'

export interface PatientRow extends Patient {
  meetingItemsCount?: number
}

interface PatientTableProps {
  data: PatientRow[]
  meetings: MeetingOption[]
  searchPlaceholder: string
}

function PatientMobileCard({ row, meetings }: { row: Row<PatientRow>; meetings: MeetingOption[] }) {
  const patient = row.original
  const [expanded, setExpanded] = React.useState(false)

  const secondary = [patient.diagnosis, patient.modality, patient.authLeft]
    .filter(Boolean)
    .slice(0, 2) as string[]

  const remaining = [
    { label: 'Diagnosis', value: patient.diagnosis },
    { label: 'Modality', value: patient.modality },
    { label: 'Auth', value: patient.authLeft },
    { label: 'Last comment', value: patient.lastMeetingComment },
  ].filter(item => item.value && !secondary.includes(item.value as string))

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {patient.fullName}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{patient.status}</Badge>
          {secondary.map((value, index) => (
            <Badge key={index} variant="secondary">
              {value}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p className="line-clamp-3">
          {patient.lastMeetingComment ?? 'No recent MDT comment.'}
        </p>
        {remaining.length ? (
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-xs"
              onClick={() => setExpanded(prev => !prev)}
            >
              {expanded ? 'Hide details' : 'More details'}
            </Button>
            {expanded ? (
              <dl className="grid gap-2 text-xs">
                {remaining.map(item => (
                  <div key={item.label} className="flex justify-between gap-3">
                    <dt className="font-medium text-foreground">{item.label}</dt>
                    <dd className="text-right text-muted-foreground">
                      {item.value as string}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-2">
        <PatientRowActions patient={patient} meetings={meetings} />
      </CardFooter>
    </Card>
  )
}

export function PatientTable({
  data,
  meetings,
  searchPlaceholder,
}: PatientTableProps) {
  const router = useRouter()

  const columns = React.useMemo<ColumnDef<PatientRow>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Name',
        cell: ({ row }) => {
          const patient = row.original
          return (
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{patient.fullName}</span>
              {patient.medicalAid ? (
                <span className="text-xs text-muted-foreground">
                  {patient.medicalAid}
                </span>
              ) : null}
            </div>
          )
        },
      },
      {
        accessorKey: 'diagnosis',
        header: 'Dx',
        meta: {
          headerClassName: 'hidden md:table-cell',
          cellClassName: 'hidden md:table-cell',
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.diagnosis ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'disciplines',
        header: 'Disciplines',
        meta: {
          headerClassName: 'hidden 2xl:table-cell',
          cellClassName: 'hidden 2xl:table-cell',
        },
        cell: ({ row }) => {
          const disciplines = disciplinesToArray(row.original.disciplines ?? '[]').filter(Boolean)
          if (!disciplines.length) {
            return <span className="text-sm text-muted-foreground">—</span>
          }

          return (
            <div className="flex flex-wrap gap-1">
              {disciplines.map((discipline: string, index: number) => (
                <Badge key={`${discipline}-${index}`} variant="secondary">
                  {discipline}
                </Badge>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'modality',
        header: 'Modality',
        meta: {
          headerClassName: 'hidden xl:table-cell',
          cellClassName: 'hidden xl:table-cell',
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.modality ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'authLeft',
        header: 'Auth',
        meta: {
          headerClassName: 'hidden lg:table-cell',
          cellClassName: 'hidden lg:table-cell',
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.authLeft ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'lastMeetingComment',
        header: 'Last Comment',
        meta: {
          headerClassName: 'hidden xl:table-cell',
          cellClassName: 'hidden xl:table-cell',
        },
        cell: ({ row }) => (
          <span className="block max-w-xs break-words text-sm text-muted-foreground">
            {row.original.lastMeetingComment ?? '—'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <PatientRowActions patient={row.original} meetings={meetings} />
          </div>
        ),
      },
    ],
    [meetings]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="fullName"
      placeholder={searchPlaceholder}
      renderMobileCard={row => <PatientMobileCard row={row} meetings={meetings} />}
      onRowClick={row => router.push(`/patients/${row.original.id}`)}
    />
  )
}
