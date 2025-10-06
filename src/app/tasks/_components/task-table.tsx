'use client'

import * as React from 'react'

import type { Patient, Task, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface TaskRow extends Task {
  patient: Patient | null
  assignedTo: User | null
  createdBy: User
}

interface TaskTableProps {
  data: TaskRow[]
  searchPlaceholder?: string
}

const priorityStyles: Record<TaskRow['priority'], string> = {
  HIGH: 'bg-destructive/10 text-destructive border-destructive/30',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
  LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const statusStyles: Record<TaskRow['status'], string> = {
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
  DONE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  BLOCKED: 'bg-rose-100 text-rose-700 border-rose-200',
}

export function TaskTable({ data, searchPlaceholder = 'Search tasks…' }: TaskTableProps) {
  const columns = React.useMemo<ColumnDef<TaskRow>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Task',
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-medium text-foreground">{row.original.title}</span>
            {row.original.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {row.original.description}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'patient',
        header: 'Patient',
        cell: ({ row }) => (
          row.original.patient ? (
            <Button asChild variant="link" size="sm" className="p-0 h-auto font-normal">
              <Link href={`/patients/${row.original.patient.id}`}>
                {row.original.patient.fullName}
              </Link>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )
        ),
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.assignedTo?.name ?? 'Unassigned'}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <Badge className={`border ${priorityStyles[row.original.priority]}`}>
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge className={`border ${statusStyles[row.original.status]}`}>
            {row.original.status.replace('_', ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.dueDate ? format(row.original.dueDate, 'PP') : '—'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" disabled>
              Update (soon)
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <DataTable<TaskRow, unknown>
      columns={columns}
      data={data}
      searchKey="title"
      placeholder={searchPlaceholder}
    />
  )
}
