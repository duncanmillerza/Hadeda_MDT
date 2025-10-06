/**
 * NextAuth configuration with Google provider and Clinician allow-list.
 */

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'

import { db } from './db'
import { checkAllowlist } from './allowlist'

type AppRole = 'ADMIN' | 'MANAGER' | 'CLINICIAN' | 'VIEWER'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false
      }

      const allowlistEntry = await checkAllowlist(user.email)
      if (!allowlistEntry) {
        return '/auth/unauthorized'
      }

      await db.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: {
          name: user.name,
          image: user.image,
        },
        create: {
          email: user.email.toLowerCase(),
          name: user.name,
          image: user.image,
          role: allowlistEntry.role,
          discipline: allowlistEntry.discipline,
        },
      })

      return true
    },
    async session({ session }) {
      if (!session.user?.email) {
        return session
      }

      const dbUser = await db.user.findUnique({
        where: { email: session.user.email.toLowerCase() },
        select: {
          id: true,
          role: true,
          discipline: true,
        },
      })

      if (dbUser && session.user) {
        session.user.id = dbUser.id
        session.user.role = dbUser.role
        session.user.discipline = dbUser.discipline
      }

      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: AppRole
      discipline?: string | null
    }
  }
}
