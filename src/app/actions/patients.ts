'use server'

/**
 * Patient Server Actions
 * Provides CRUD helpers with auditing + cache revalidation.
 */

import { revalidatePath } from 'next/cache'
import { PatientStatus } from '@prisma/client'

import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'
import { db } from '@/lib/db'
import {
  PatientFormData,
  patientSchema,
} from '@/lib/validations/patient'

/**
 * Fetch patients optionally filtered by status.
 */
export async function getPatients(status?: string) {
  const where = status
    ? { status: status as PatientStatus }
    : undefined

  return db.patient.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          notes: true,
          tasks: true,
          meetingItems: true,
        },
      },
    },
  })
}

/**
 * Fetch a single patient with related entities for detail pages.
 */
export async function getPatient(id: string) {
  return db.patient.findUnique({
    where: { id },
    include: {
      notes: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
      tasks: {
        include: { assignedTo: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
      },
      meetingItems: {
        include: { meeting: true },
        orderBy: { createdAt: 'desc' },
      },
      assignments: {
        include: { clinician: true },
      },
    },
  })
}

/**
 * Create a new patient record.
 */
export async function createPatient(data: PatientFormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = patientSchema.parse(data)

  const patient = await db.patient.create({
    data: validated,
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Patient',
    entityId: patient.id,
    action: 'CREATE',
    metadata: { status: patient.status },
  })

  await revalidatePatientViews(patient.id)
  return patient
}

/**
 * Update an existing patient.
 */
export async function updatePatient(
  id: string,
  data: Partial<PatientFormData>
) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = patientSchema.partial().parse(data)

  const patient = await db.patient.update({
    where: { id },
    data: validated,
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Patient',
    entityId: patient.id,
    action: 'UPDATE',
    metadata: { fields: Object.keys(validated) },
  })

  await revalidatePatientViews(patient.id)
  return patient
}

/**
 * Delete a patient and associated data.
 */
export async function deletePatient(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await db.patient.delete({
    where: { id },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Patient',
    entityId: id,
    action: 'DELETE',
  })

  await revalidatePatientViews(id)
}

async function revalidatePatientViews(patientId: string) {
  revalidatePath('/mdt')
  revalidatePath('/patients')
  revalidatePath(`/patients/${patientId}`)
}
