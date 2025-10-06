'use server'

/**
 * Task Server Actions
 */

import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'
import { db } from '@/lib/db'
import { TaskFormData, taskSchema } from '@/lib/validations/task'

function assertCanManageTeamTasks(role: string) {
  if (role === 'CLINICIAN' || role === 'VIEWER') {
    throw new Error('Insufficient permissions')
  }
}

export async function getMyTasks() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  return db.task.findMany({
    where: { assignedToId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      patient: true,
      assignedTo: true,
      createdBy: true,
    },
  })
}

export async function getTeamTasks() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  assertCanManageTeamTasks(session.user.role)

  return db.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      patient: true,
      assignedTo: true,
      createdBy: true,
    },
  })
}

export async function createTask(data: TaskFormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = taskSchema.parse(data)

  const task = await db.task.create({
    data: {
      ...validated,
      createdById: session.user.id,
    },
    include: {
      patient: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Task',
    entityId: task.id,
    action: 'CREATE',
  })

  await revalidateTaskViews(task.patientId, task.meetingItem?.meetingId)
  return task
}

export async function updateTask(
  id: string,
  data: Partial<TaskFormData>
) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = taskSchema.partial().parse(data)

  const task = await db.task.update({
    where: { id },
    data: validated,
    include: {
      patient: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Task',
    entityId: task.id,
    action: 'UPDATE',
    metadata: { fields: Object.keys(validated) },
  })

  await revalidateTaskViews(task.patientId, task.meetingItem?.meetingId)
  return task
}

export async function deleteTask(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const task = await db.task.findUnique({
    where: { id },
    select: {
      id: true,
      patientId: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  if (!task) throw new Error('Task not found')

  await db.task.delete({ where: { id } })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Task',
    entityId: id,
    action: 'DELETE',
  })

  await revalidateTaskViews(task.patientId, task.meetingItem?.meetingId)
}

async function revalidateTaskViews(
  patientId: string | null | undefined,
  meetingId: string | null | undefined
) {
  revalidatePath('/tasks')

  if (patientId) {
    revalidatePath(`/patients/${patientId}`)
  }

  if (meetingId) {
    revalidatePath(`/meetings/${meetingId}`)
  }
}
