/**
 * Middleware - Route Protection
 * Protects all app routes except auth pages
 */

export { auth as middleware } from '@/lib/auth'

// Protect all routes except auth pages
export const config = {
  matcher: [
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
