/**
 * Helper functions for handling disciplines field
 * Disciplines are stored as JSON strings in SQLite for compatibility
 */

export function disciplinesToString(disciplines: string[] | string): string {
  if (typeof disciplines === 'string') {
    // Already a string, check if it's valid JSON
    try {
      JSON.parse(disciplines)
      return disciplines
    } catch {
      // Not JSON, treat as single discipline
      return JSON.stringify([disciplines])
    }
  }
  return JSON.stringify(disciplines)
}

export function disciplinesToArray(disciplines: string | string[]): string[] {
  if (Array.isArray(disciplines)) {
    return disciplines
  }

  if (!disciplines) {
    return []
  }

  try {
    const parsed = JSON.parse(disciplines)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    // If parsing fails, treat as a single discipline
    return [disciplines]
  }
}
