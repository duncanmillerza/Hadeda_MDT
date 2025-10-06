/**
 * Patient Import Service
 * Handles bulk upsert of patients from XLSX with transaction batching
 */

import { db } from '../db'
import { createAuditLog } from '../audit-log'
import { ParsedPatient } from './parse-xlsx'
import { PatientStatus } from '@prisma/client'

const BATCH_SIZE = 500

export interface ImportResult {
  success: boolean
  imported: number
  updated: number
  failed: number
  errors: { row: number; error: string }[]
}

export async function importPatients(
  patients: ParsedPatient[],
  actorId: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    updated: 0,
    failed: 0,
    errors: [],
  }

  // Process in batches to avoid overwhelming the database
  for (let i = 0; i < patients.length; i += BATCH_SIZE) {
    const batch = patients.slice(i, i + BATCH_SIZE)

    try {
      await db.$transaction(async (tx) => {
        for (const patient of batch) {
          try {
            // Upsert patient by fullName (assuming names are unique enough)
            const existing = await tx.patient.findFirst({
              where: {
                fullName: patient.fullName,
                status: patient.status as PatientStatus,
              },
            })

            if (existing) {
              // Update existing patient
              await tx.patient.update({
                where: { id: existing.id },
                data: {
                  age: patient.age,
                  diagnosis: patient.diagnosis,
                  startDate: patient.startDate,
                  medicalAid: patient.medicalAid,
                  disciplines: patient.disciplines,
                  modality: patient.modality,
                  authLeft: patient.authLeft,
                  lastMeetingComment: patient.lastMeetingComment,
                  socialWork: patient.socialWork,
                  doctor: patient.doctor,
                  psychology: patient.psychology,
                  updatedAt: new Date(),
                },
              })
              result.updated++
            } else {
              // Create new patient
              const created = await tx.patient.create({
                data: {
                  fullName: patient.fullName,
                  age: patient.age,
                  diagnosis: patient.diagnosis,
                  startDate: patient.startDate,
                  medicalAid: patient.medicalAid,
                  disciplines: patient.disciplines,
                  modality: patient.modality,
                  authLeft: patient.authLeft,
                  status: patient.status as PatientStatus,
                  lastMeetingComment: patient.lastMeetingComment,
                  socialWork: patient.socialWork,
                  doctor: patient.doctor,
                  psychology: patient.psychology,
                },
              })
              result.imported++

              // Create audit log for new patient
              await createAuditLog({
                actorId,
                entity: 'Patient',
                entityId: created.id,
                action: 'IMPORT',
                metadata: {
                  source: 'xlsx_import',
                  status: patient.status,
                },
              })
            }
          } catch (error) {
            result.failed++
            result.errors.push({
              row: i + batch.indexOf(patient) + 1,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }
      })
    } catch (error) {
      result.success = false
      result.errors.push({
        row: i,
        error: `Batch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }

  return result
}
