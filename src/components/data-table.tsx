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
  renderMobileCard?: (row: Row<TData>) => React.ReactNode
  onRowClick?: (row: Row<TData>) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  placeholder = 'Search…',
  className,
  emptyMessage = 'No results.',
  renderSubRow,
  renderMobileCard,
  onRowClick,
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

  const rows = table.getRowModel().rows

  return (
    <div className={cn('space-y-4', className)}>
      {renderMobileCard ? (
        <div className="grid gap-3 md:hidden">
          {rows.length ? rows.map(row => (
            <React.Fragment key={row.id}>{renderMobileCard(row)}</React.Fragment>
          )) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}

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

      <div className="hidden rounded-md border md:block">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const meta = header.column.columnDef.meta as
                    | { headerClassName?: string }
                    | undefined
                  return (
                    <TableHead
                      key={header.id}
                      className={cn('whitespace-nowrap', meta?.headerClassName)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.length ? (
              rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={event => {
                      if (!onRowClick) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onRowClick(row)
                      }
                    }}
                    className={cn(
                      onRowClick &&
                        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                  >
                    {row.getVisibleCells().map(cell => {
                      const meta = cell.column.columnDef.meta as
                        | { cellClassName?: string }
                        | undefined
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn('align-top break-words', meta?.cellClassName)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
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
