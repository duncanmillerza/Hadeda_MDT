'use server'

/**
 * Meeting Server Actions
 */

import { revalidatePath } from 'next/cache'
import { AgendaStatus } from '@prisma/client'

import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'
import { db } from '@/lib/db'
import {
  MeetingFormData,
  meetingSchema,
} from '@/lib/validations/meeting'

export async function getMeetings() {
  return db.mDTMeeting.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: { select: { items: true } },
    },
  })
}

export async function getMeeting(id: string) {
  return db.mDTMeeting.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          patient: true,
          notes: { include: { author: true } },
          tasks: {
            include: {
              assignedTo: true,
              createdBy: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function createMeeting(data: MeetingFormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = meetingSchema.parse(data)

  const meeting = await db.mDTMeeting.create({
    data: {
      ...validated,
      createdBy: session.user.id,
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'MDTMeeting',
    entityId: meeting.id,
    action: 'CREATE',
  })

  revalidatePath('/meetings')
  return meeting
}

export async function addPatientToMeeting(
  meetingId: string,
  patientId: string
) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const item = await db.mDTMeetingItem.create({
    data: {
      meetingId,
      patientId,
      status: 'TO_DISCUSS',
    },
    select: {
      id: true,
      meetingId: true,
      patientId: true,
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'MDTMeetingItem',
    entityId: item.id,
    action: 'CREATE',
  })

  await revalidateMeetingAndPatient(item.meetingId, item.patientId)
  return item
}

export async function updateMeetingItemStatus(id: string, status: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const item = await db.mDTMeetingItem.update({
    where: { id },
    data: { status: status as AgendaStatus },
    select: {
      id: true,
      status: true,
      meetingId: true,
      patientId: true,
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'MDTMeetingItem',
    entityId: item.id,
    action: 'UPDATE',
    metadata: { status: item.status },
  })

  await revalidateMeetingAndPatient(item.meetingId, item.patientId)
  return item
}

export async function updateMeetingItemOutcome(id: string, outcome: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const item = await db.mDTMeetingItem.update({
    where: { id },
    data: { outcome },
    select: {
      id: true,
      outcome: true,
      meetingId: true,
      patientId: true,
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'MDTMeetingItem',
    entityId: item.id,
    action: 'UPDATE',
    metadata: { outcome },
  })

  await revalidateMeetingAndPatient(item.meetingId, item.patientId)
  return item
}

async function revalidateMeetingAndPatient(
  meetingId: string,
  patientId: string
) {
  revalidatePath(`/meetings/${meetingId}`)
  revalidatePath('/meetings')
  revalidatePath(`/patients/${patientId}`)
}
