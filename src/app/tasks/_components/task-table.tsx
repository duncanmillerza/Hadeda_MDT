'use client'

import * as React from 'react'

import type { Patient, Task, User } from '@prisma/client'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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

function TaskMobileCard({ row }: { row: Row<TaskRow> }) {
  const task = row.original
  const secondary = [task.patient?.fullName, task.assignedTo?.name]
    .filter(Boolean)
    .slice(0, 2) as string[]

  const details = [
    { label: 'Patient', value: task.patient?.fullName },
    { label: 'Assigned', value: task.assignedTo?.name ?? 'Unassigned' },
    { label: 'Due', value: task.dueDate ? format(task.dueDate, 'PP') : '—' },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {task.title}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge className={`border ${priorityStyles[task.priority]}`}>{task.priority}</Badge>
          <Badge className={`border ${statusStyles[task.status]}`}>
            {task.status.replace('_', ' ')}
          </Badge>
          {secondary.map((value, index) => (
            <Badge key={index} variant="secondary">
              {value}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {task.description ? (
          <p className="line-clamp-4">{task.description}</p>
        ) : (
          <p>No additional description.</p>
        )}
        <dl className="grid gap-2 text-xs">
          {details.map(item => (
            <div key={item.label} className="flex justify-between gap-2">
              <dt className="font-medium text-foreground">{item.label}</dt>
              <dd className="text-right text-muted-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size="sm" variant="outline" disabled>
          Update (soon)
        </Button>
      </CardFooter>
    </Card>
  )
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
        meta: {
          headerClassName: 'hidden xl:table-cell',
          cellClassName: 'hidden xl:table-cell',
        },
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
        meta: {
          headerClassName: 'hidden xl:table-cell',
          cellClassName: 'hidden xl:table-cell',
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.assignedTo?.name ?? 'Unassigned'}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        meta: {
          headerClassName: 'hidden lg:table-cell',
          cellClassName: 'hidden lg:table-cell',
        },
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
        meta: {
          headerClassName: 'hidden xl:table-cell',
          cellClassName: 'hidden xl:table-cell',
        },
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
      renderMobileCard={row => <TaskMobileCard row={row} />}
    />
  )
}
