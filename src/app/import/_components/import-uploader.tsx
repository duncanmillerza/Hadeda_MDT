'use client'

import * as React from 'react'

import { AlertCircle, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface PreviewRow {
  fullName: string
  status: string
  diagnosis?: string | null
  modality?: string | null
  authLeft?: string | null
}

interface PreviewSheet {
  name: string
  status: string
  totalRows: number
  rows: PreviewRow[]
}

interface PreviewResponse {
  mode: 'preview'
  sheets: PreviewSheet[]
  summary: {
    totalSheets: number
    totalRows: number
    errors: string[]
  }
}

interface ImportResult {
  mode: 'import'
  summary: PreviewResponse['summary']
  result: {
    success: boolean
    imported: number
    updated: number
    failed: number
    errors: { row: number; error: string }[]
  }
}

export function ImportUploader() {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<PreviewResponse | null>(null)
  const [result, setResult] = React.useState<ImportResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const resetState = () => {
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setFile(nextFile)
    resetState()
  }

  const submit = async (intent: 'preview' | 'import') => {
    if (!file) {
      setError('Select an .xlsx file to continue.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('intent', intent)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Import request failed')
      }

      const data = (await response.json()) as PreviewResponse | ImportResult

      if (data.mode === 'preview') {
        setPreview(data)
        setResult(null)
        toast.success('Preview ready')
      } else {
        setResult(data)
        toast.success('Import completed')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Import failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload spreadsheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" accept=".xlsx" onChange={handleFileChange} disabled={isLoading} />
          <p className="text-xs text-muted-foreground">
            Supported format: Excel (.xlsx) with patient cohorts in separate sheets.
          </p>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={() => submit('preview')} disabled={!file || isLoading} className="gap-2">
            <Upload className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="secondary"
            onClick={() => submit('import')}
            disabled={!file || !preview || isLoading}
          >
            Confirm import
          </Button>
        </CardFooter>
      </Card>

      {preview ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Sheets: {preview.summary.totalSheets}</Badge>
              <Badge variant="outline">Rows: {preview.summary.totalRows}</Badge>
            </div>

            {preview.summary.errors.length ? (
              <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Issues detected
                </div>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {preview.summary.errors.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {preview.sheets.map(sheet => (
              <div key={sheet.name} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                  <span>{sheet.name}</span>
                  <Badge variant="secondary">Status: {sheet.status}</Badge>
                  <Badge variant="outline">Rows: {sheet.totalRows}</Badge>
                </div>

                <div className="grid gap-3 md:hidden">
                  {sheet.rows.length ? (
                    sheet.rows.map((row, index) => (
                      <Card key={`${sheet.name}-mobile-${index}`} className="border-border/60">
                        <CardHeader className="space-y-1">
                          <CardTitle className="text-base font-semibold leading-tight">
                            {row.fullName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex justify-between gap-3">
                            <span className="font-medium text-foreground">Diagnosis</span>
                            <span>{row.diagnosis ?? '—'}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="font-medium text-foreground">Modality</span>
                            <span>{row.modality ?? '—'}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="font-medium text-foreground">Auth</span>
                            <span>{row.authLeft ?? '—'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-sm text-muted-foreground">
                        No sample rows available.
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="hidden rounded-md border md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Modality</TableHead>
                        <TableHead>Auth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheet.rows.length ? (
                        sheet.rows.map((row, index) => (
                          <TableRow key={`${sheet.name}-${index}`}>
                            <TableCell className="font-medium">{row.fullName}</TableCell>
                            <TableCell>{row.diagnosis ?? '—'}</TableCell>
                            <TableCell>{row.modality ?? '—'}</TableCell>
                            <TableCell>{row.authLeft ?? '—'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                            No sample rows available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Import summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Imported: {result.result.imported}</Badge>
              <Badge variant="outline">Updated: {result.result.updated}</Badge>
              <Badge variant="outline">Failed: {result.result.failed}</Badge>
            </div>
            {result.result.errors.length ? (
              <div className="rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Row level issues
                </div>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {result.result.errors.slice(0, 10).map((issue, index) => (
                    <li key={`${issue.row}-${index}`}>
                      Row {issue.row}: {issue.error}
                    </li>
                  ))}
                </ul>
                {result.result.errors.length > 10 ? (
                  <p className="mt-2 italic">
                    Showing first 10 errors. Check audit logs for the full list.
                  </p>
                ) : null}
              </div>
            ) : (
              <p>All patients imported successfully.</p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
