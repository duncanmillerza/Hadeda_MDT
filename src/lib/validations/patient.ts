/**
 * Patient validation schemas
 */

import { z } from 'zod'

export const patientStatusEnum = z.enum([
  'ACTIVE',
  'DISCHARGED',
  'WAITING_AUTH',
  'HEADWAY',
])

// Schema for form input (accepts array)
export const patientFormSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  age: z.number().int().min(0).max(150).optional().nullable(),
  diagnosis: z.string().max(500).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  medicalAid: z.string().max(100).optional().nullable(),
  disciplines: z.array(z.string()).default([]),
  modality: z.string().max(50).optional().nullable(),
  authLeft: z.string().max(200).optional().nullable(),
  status: patientStatusEnum.default('ACTIVE'),
  lastMeetingComment: z.string().max(1000).optional().nullable(),
  socialWork: z.string().max(500).optional().nullable(),
  doctor: z.string().max(100).optional().nullable(),
  psychology: z.string().max(500).optional().nullable(),
})

// Schema for database (transforms array to JSON string)
export const patientSchema = patientFormSchema.transform((data) => ({
  ...data,
  disciplines: JSON.stringify(data.disciplines),
}))

export type PatientFormData = z.infer<typeof patientFormSchema>
export type PatientDBData = z.infer<typeof patientSchema>
