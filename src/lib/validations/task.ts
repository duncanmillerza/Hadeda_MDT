/**
 * Task validation schemas
 */

import { z } from 'zod'

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])
export const taskStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'BLOCKED'])

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  priority: taskPriorityEnum.default('MEDIUM'),
  status: taskStatusEnum.default('OPEN'),
  dueDate: z.coerce.date().optional().nullable(),
  patientId: z.string().uuid().optional().nullable(),
  meetingItemId: z.string().uuid().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>
