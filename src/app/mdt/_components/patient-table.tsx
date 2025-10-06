'use client'

import * as React from 'react'

import type { Patient } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PatientRowActions, type MeetingOption } from './patient-row-actions'

export interface PatientRow extends Patient {
  meetingItemsCount?: number
}

interface PatientTableProps {
  data: PatientRow[]
  meetings: MeetingOption[]
  searchPlaceholder: string
}

export function PatientTable({
  data,
  meetings,
  searchPlaceholder,
}: PatientTableProps) {
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
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.diagnosis ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'disciplines',
        header: 'Disciplines',
        cell: ({ row }) => {
          const disciplines = (row.original.disciplines ?? []).filter(Boolean)
          if (!disciplines.length) {
            return <span className="text-sm text-muted-foreground">—</span>
          }

          return (
            <div className="flex flex-wrap gap-1">
              {disciplines.map((discipline, index) => (
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
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.modality ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'authLeft',
        header: 'Auth',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.authLeft ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'lastMeetingComment',
        header: 'Last Comment',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
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
            <Button asChild size="sm">
              <Link href={`/patients/${row.original.id}`}>View</Link>
            </Button>
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
    />
  )
}
