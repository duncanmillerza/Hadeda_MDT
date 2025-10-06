/**
 * Meeting validation schemas
 */

import { z } from 'zod'

export const agendaStatusEnum = z.enum(['TO_DISCUSS', 'DISCUSSED', 'DEFERRED'])

export const meetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  date: z.coerce.date(),
  location: z.string().max(200).optional().nullable(),
})

export const meetingItemSchema = z.object({
  patientId: z.string().uuid(),
  meetingId: z.string().uuid(),
  status: agendaStatusEnum.default('TO_DISCUSS'),
  summary: z.string().max(2000).optional().nullable(),
  outcome: z.string().max(2000).optional().nullable(),
})

export type MeetingFormData = z.infer<typeof meetingSchema>
export type MeetingItemFormData = z.infer<typeof meetingItemSchema>
