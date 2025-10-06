'use server'

/**
 * Note Server Actions
 */

import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'
import { db } from '@/lib/db'
import { NoteFormData, noteSchema } from '@/lib/validations/note'

export async function createNote(data: NoteFormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = noteSchema.parse(data)

  const note = await db.note.create({
    data: {
      ...validated,
      authorId: session.user.id,
    },
    select: {
      id: true,
      patientId: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Note',
    entityId: note.id,
    action: 'CREATE',
  })

  await revalidateNoteViews(note.patientId, note.meetingItem?.meetingId)
  return note
}

export async function updateNote(
  id: string,
  data: Partial<Pick<NoteFormData, 'body' | 'category'>>
) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = noteSchema
    .pick({ body: true, category: true })
    .partial()
    .parse(data)

  const note = await db.note.update({
    where: { id },
    data: validated,
    select: {
      id: true,
      patientId: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Note',
    entityId: note.id,
    action: 'UPDATE',
    metadata: { fields: Object.keys(validated) },
  })

  await revalidateNoteViews(note.patientId, note.meetingItem?.meetingId)
  return note
}

export async function deleteNote(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const note = await db.note.findUnique({
    where: { id },
    select: {
      id: true,
      patientId: true,
      meetingItem: { select: { meetingId: true } },
    },
  })

  if (!note) throw new Error('Note not found')

  await db.note.delete({
    where: { id },
  })

  await createAuditLog({
    actorId: session.user.id,
    entity: 'Note',
    entityId: id,
    action: 'DELETE',
  })

  await revalidateNoteViews(note.patientId, note.meetingItem?.meetingId)
}

async function revalidateNoteViews(
  patientId: string,
  meetingId?: string | null
) {
  revalidatePath(`/patients/${patientId}`)
  if (meetingId) {
    revalidatePath(`/meetings/${meetingId}`)
  }
}
