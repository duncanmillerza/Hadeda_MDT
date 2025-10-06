'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'
import { db } from '@/lib/db'
import {
  AllowlistFormData,
  allowlistSchema,
} from '@/lib/validations/allowlist'

function assertAdmin(role?: string) {
  if (role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
}

const ADMIN_PATH = '/admin/allowlist'

export async function listAllowlist() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  assertAdmin(session.user.role)

  return db.clinicianAllowlist.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function createAllowlistEntry(data: AllowlistFormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  assertAdmin(session.user.role)

  const validated = allowlistSchema.parse(data)

  const entry = await db.clinicianAllowlist.create({ data: validated })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'ClinicianAllowlist',
    entityId: entry.id,
    action: 'CREATE',
  })

  revalidatePath(ADMIN_PATH)
  return entry
}

export async function updateAllowlistEntry(
  id: string,
  data: Partial<AllowlistFormData>
) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  assertAdmin(session.user.role)

  const parsed = allowlistSchema.partial().parse(data)

  const entry = await db.clinicianAllowlist.update({
    where: { id },
    data: parsed,
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'ClinicianAllowlist',
    entityId: entry.id,
    action: 'UPDATE',
    metadata: { fields: Object.keys(parsed) },
  })

  revalidatePath(ADMIN_PATH)
  return entry
}

export async function deleteAllowlistEntry(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  assertAdmin(session.user.role)

  await db.clinicianAllowlist.delete({ where: { id } })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'ClinicianAllowlist',
    entityId: id,
    action: 'DELETE',
  })

  revalidatePath(ADMIN_PATH)
}
