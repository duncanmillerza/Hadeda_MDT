/**
 * Allowlist validation schema
 */

import { z } from 'zod'

export const allowlistSchema = z.object({
  email: z
    .string()
    .email('Valid email required')
    .transform(value => value.toLowerCase().trim()),
  name: z.string().max(100).optional().nullable(),
  discipline: z.string().max(100).optional().nullable(),
  role: z.enum(['ADMIN', 'MANAGER', 'CLINICIAN', 'VIEWER']).default('CLINICIAN'),
})

export type AllowlistFormData = z.infer<typeof allowlistSchema>
