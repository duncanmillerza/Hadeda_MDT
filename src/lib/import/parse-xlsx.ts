/**
 * XLSX Parser for Patient Import
 * Handles robust parsing of Excel files with header normalization
 */

import ExcelJS, { CellValue } from 'exceljs'
import { Buffer } from 'node:buffer'

// Sheet name to PatientStatus mapping
const SHEET_STATUS_MAP: Record<string, string> = {
  'Active PTS': 'ACTIVE',
  'DC patients': 'DISCHARGED',
  'waiting for auth': 'WAITING_AUTH',
  'Headway patients': 'HEADWAY',
}

// Column header normalization - removes extra spaces, lowercases
function normalizeHeader(header: string | null | undefined): string {
  if (!header) return ''
  return header
    .toString()
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .toLowerCase()
}

// Parse date values robustly
function parseDate(value: CellValue): Date | null {
  if (!value) return null
  if (value instanceof Date) return value

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

// Split disciplines by multiple delimiters
function parseDisciplines(value: string | null | undefined): string[] {
  if (!value) return []

  return value
    .toString()
    .split(/[/,;]+/) // Split by /, comma, or semicolon
    .map(d => d.trim())
    .filter(d => d.length > 0)
}

// Column mapping configuration
const COLUMN_MAP: Record<string, string> = {
  'name': 'fullName',
  'age': 'age',
  'dx': 'diagnosis',
  'date starting opd': 'startDate',
  'ma': 'medicalAid',
  'disciplines': 'disciplines',
  'f2f/ hbr': 'modality',
  'f2f/hbr': 'modality',
  'auth update 23/09': 'authLeft',
  'auth left': 'authLeft',
  'social work': 'socialWork',
  'doctor': 'doctor',
  'psychology': 'psychology',
  'comments from last team meeting': 'lastMeetingComment',
  'voc/rtw update': 'lastMeetingComment', // Alternative field
}

export interface ParsedPatient {
  fullName: string
  age?: number
  diagnosis?: string
  startDate?: Date
  medicalAid?: string
  disciplines: string // Stored as JSON string for SQLite compatibility
  modality?: string
  authLeft?: string
  status: string
  lastMeetingComment?: string
  socialWork?: string
  doctor?: string
  psychology?: string
}

export interface ImportPreview {
  sheets: {
    name: string
    status: string
    rows: ParsedPatient[]
    totalRows: number
  }[]
  summary: {
    totalSheets: number
    totalRows: number
    errors: string[]
  }
}

type XLSXBuffer = ArrayBuffer | Uint8Array | ExcelJS.Buffer

function normaliseBuffer(input: XLSXBuffer): ExcelJS.Buffer {
  if (Buffer.isBuffer(input)) return input as unknown as ExcelJS.Buffer
  if (input instanceof Uint8Array) return Buffer.from(input) as unknown as ExcelJS.Buffer
  return Buffer.from(input) as unknown as ExcelJS.Buffer
}

export async function parseXLSX(input: XLSXBuffer): Promise<ImportPreview> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(normaliseBuffer(input))

  const result: ImportPreview = {
    sheets: [],
    summary: {
      totalSheets: 0,
      totalRows: 0,
      errors: [],
    },
  }

  for (const worksheet of workbook.worksheets) {
    const sheetName = worksheet.name
    const status = SHEET_STATUS_MAP[sheetName]

    if (!status) {
      result.summary.errors.push(`Unknown sheet: ${sheetName}`)
      continue
    }

    result.summary.totalSheets++

    // Handle special case: Headway patients (single column)
    if (status === 'HEADWAY') {
      const headwayPatients = parseHeadwaySheet(worksheet)
      result.sheets.push({
        name: sheetName,
        status,
        rows: headwayPatients,
        totalRows: headwayPatients.length,
      })
      result.summary.totalRows += headwayPatients.length
      continue
    }

    // Parse regular sheets
    const parsed = parseRegularSheet(worksheet, status)
    result.sheets.push({
      name: sheetName,
      status,
      rows: parsed.rows,
      totalRows: parsed.rows.length,
    })
    result.summary.totalRows += parsed.rows.length
    result.summary.errors.push(...parsed.errors)
  }

  return result
}

function parseHeadwaySheet(worksheet: ExcelJS.Worksheet): ParsedPatient[] {
  const patients: ParsedPatient[] = []

  // Skip header row, iterate through patient names
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // Skip header

    const cellValue = row.getCell(1).value
    if (!cellValue) return

    const name = cellValue.toString().trim()
    if (!name) return

    patients.push({
      fullName: name,
      status: 'HEADWAY',
      disciplines: '[]',
    })
  })

  return patients
}

function parseRegularSheet(
  worksheet: ExcelJS.Worksheet,
  status: string
): { rows: ParsedPatient[]; errors: string[] } {
  const patients: ParsedPatient[] = []
  const errors: string[] = []

  // Get header row
  const headerRow = worksheet.getRow(1)
  const headers: string[] = []

  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = normalizeHeader(cell.value?.toString())
  })

  // Parse data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // Skip header

    const rowData: Record<string, CellValue> = {}

    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber]
      if (header) {
        rowData[header] = cell.value
      }
    })

    // Skip empty rows
    if (!rowData['name'] && !rowData['fullName']) return

    try {
      const patient = mapRowToPatient(rowData, status)
      patients.push(patient)
    } catch (error) {
      errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Parse error'}`)
    }
  })

  return { rows: patients, errors }
}

function mapRowToPatient(rowData: Record<string, CellValue>, status: string): ParsedPatient {
  const patient: ParsedPatient = {
    fullName: '',
    status,
    disciplines: '[]',
  }

  // Map columns to patient fields
  for (const [rawHeader, value] of Object.entries(rowData)) {
    const fieldName = COLUMN_MAP[rawHeader]

    if (!fieldName || !value) continue

    switch (fieldName) {
      case 'fullName':
        patient.fullName = value.toString().trim()
        break
      case 'age':
        const age = parseInt(value.toString())
        if (!isNaN(age)) patient.age = age
        break
      case 'startDate':
        patient.startDate = parseDate(value) || undefined
        break
      case 'disciplines':
        patient.disciplines = JSON.stringify(parseDisciplines(value.toString()))
        break
      case 'diagnosis':
        patient.diagnosis = value.toString().trim()
        break
      case 'medicalAid':
        patient.medicalAid = value.toString().trim()
        break
      case 'modality':
        patient.modality = value.toString().trim()
        break
      case 'authLeft':
        patient.authLeft = value.toString().trim()
        break
      case 'lastMeetingComment':
        patient.lastMeetingComment = value.toString().trim()
        break
      case 'socialWork':
        patient.socialWork = value.toString().trim()
        break
      case 'doctor':
        patient.doctor = value.toString().trim()
        break
      case 'psychology':
        patient.psychology = value.toString().trim()
        break
      default:
        break
    }
  }

  if (!patient.fullName) {
    throw new Error('Missing patient name')
  }

  return patient
}
