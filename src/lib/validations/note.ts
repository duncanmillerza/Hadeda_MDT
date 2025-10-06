/**
 * Note validation schemas
 */

import { z } from 'zod'

export const noteCategoryEnum = z.enum([
  'MDT_FEEDBACK',
  'DOCTOR',
  'PSYCHOLOGY',
  'SOCIAL_WORK',
  'GENERAL',
])

export const noteSchema = z.object({
  body: z.string().min(1, 'Note content is required').max(5000),
  category: noteCategoryEnum.default('MDT_FEEDBACK'),
  patientId: z.string().uuid(),
  meetingItemId: z.string().uuid().optional().nullable(),
})

export type NoteFormData = z.infer<typeof noteSchema>
