/**
 * Audit Log Service
 * Tracks all mutations (create/update/delete/import) for compliance
 */

import { db } from './db'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT'

export type AuditEntity =
  | 'Patient'
  | 'User'
  | 'MDTMeeting'
  | 'MDTMeetingItem'
  | 'Note'
  | 'Task'
  | 'Assignment'
  | 'ClinicianAllowlist'

interface CreateAuditLogParams {
  actorId: string | null
  entity: AuditEntity
  entityId: string
  action: AuditAction
  metadata?: Record<string, unknown>
}

/**
 * Create an audit log entry
 */
export async function createAuditLog({
  actorId,
  entity,
  entityId,
  action,
  metadata,
}: CreateAuditLogParams) {
  try {
    await db.auditLog.create({
      data: {
        actorId,
        entity,
        entityId,
        action,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit log failures shouldn't break the main operation
  }
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogs(entity: AuditEntity, entityId: string) {
  return db.auditLog.findMany({
    where: {
      entity,
      entityId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Get recent audit logs with optional filtering
 */
export async function getRecentAuditLogs({
  limit = 50,
  entity,
  actorId,
}: {
  limit?: number
  entity?: AuditEntity
  actorId?: string
} = {}) {
  return db.auditLog.findMany({
    where: {
      ...(entity && { entity }),
      ...(actorId && { actorId }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}
