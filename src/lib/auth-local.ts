/**
 * Local Authentication for Standalone Mode
 * Simple credential-based auth without OAuth
 */

import { db } from './db'
import { compare, hash } from 'bcryptjs'

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hash(password, 10)

  // Check allowlist
  const allowlistEntry = await db.clinicianAllowlist.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!allowlistEntry) {
    throw new Error('Email not found in allowlist')
  }

  const user = await db.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: allowlistEntry.role,
      discipline: allowlistEntry.discipline,
    },
  })

  return user
}

export async function verifyCredentials(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user || !user.password) {
    return null
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    discipline: user.discipline,
  }
}
