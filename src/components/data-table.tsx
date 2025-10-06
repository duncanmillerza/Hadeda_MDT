'use client'

import * as React from 'react'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  placeholder?: string
  className?: string
  emptyMessage?: React.ReactNode
  renderSubRow?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  placeholder = 'Search…',
  className,
  emptyMessage = 'No results.',
  renderSubRow,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const hasFilters = searchKey && table.getColumn(searchKey)

  return (
    <div className={cn('space-y-4', className)}>
      {hasFilters ? (
        <div className="flex items-center justify-between gap-3">
          <Input
            placeholder={placeholder}
            value={(table.getColumn(searchKey!)?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn(searchKey!)?.setFilterValue(event.target.value)
            }
            className="h-10 w-full max-w-sm"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {table.getFilteredRowModel().rows.length} result
              {table.getFilteredRowModel().rows.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubRow ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="bg-muted/40">
                        {renderSubRow(row)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
