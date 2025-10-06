/**
 * Allowlist Utilities
 * Manages clinician email allow-list for authentication
 */

import { db } from './db'

/**
 * Check if an email is on the allow-list (case-insensitive)
 */
export async function checkAllowlist(email: string) {
  const normalizedEmail = email.toLowerCase().trim()

  return db.clinicianAllowlist.findUnique({
    where: { email: normalizedEmail },
  })
}

/**
 * Add email to allow-list
 */
export async function addToAllowlist(data: {
  email: string
  name?: string
  discipline?: string
  role?: 'ADMIN' | 'MANAGER' | 'CLINICIAN' | 'VIEWER'
}) {
  return db.clinicianAllowlist.create({
    data: {
      ...data,
      email: data.email.toLowerCase().trim(),
    },
  })
}

/**
 * Remove email from allow-list
 */
export async function removeFromAllowlist(email: string) {
  const normalizedEmail = email.toLowerCase().trim()

  return db.clinicianAllowlist.delete({
    where: { email: normalizedEmail },
  })
}

/**
 * Get all allowlist entries
 */
export async function getAllowlist() {
  return db.clinicianAllowlist.findMany({
    orderBy: { createdAt: 'desc' },
  })
}
