import { Buffer } from 'node:buffer'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { importPatients } from '@/lib/import/import-patients'
import { parseXLSX } from '@/lib/import/parse-xlsx'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file upload' }, { status: 400 })
    }

    const intent = (formData.get('intent')?.toString() ?? 'preview').toLowerCase()

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await parseXLSX(buffer)

    if (intent === 'preview') {
      const preview = parsed.sheets.map(sheet => ({
        name: sheet.name,
        status: sheet.status,
        totalRows: sheet.totalRows,
        rows: sheet.rows.slice(0, 20),
      }))

      return NextResponse.json({
        mode: 'preview',
        sheets: preview,
        summary: parsed.summary,
      })
    }

    if (intent === 'import') {
      const patients = parsed.sheets.flatMap(sheet => sheet.rows)
      const result = await importPatients(patients, session.user.id)

      return NextResponse.json({
        mode: 'import',
        summary: parsed.summary,
        result,
      })
    }

    return NextResponse.json({ error: 'Invalid intent' }, { status: 400 })
  } catch (error) {
    console.error('Import failed', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
