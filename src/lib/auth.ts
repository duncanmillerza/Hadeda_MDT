/**
 * NextAuth configuration with dual mode support:
 * - Google OAuth (cloud mode)
 * - Local credentials (standalone mode)
 */

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import { db } from './db'
import { checkAllowlist } from './allowlist'
import { verifyCredentials } from './auth-local'

type AppRole = 'ADMIN' | 'MANAGER' | 'CLINICIAN' | 'VIEWER'

// Standalone mode: no Google OAuth credentials
const isStandaloneMode = !process.env.GOOGLE_CLIENT_ID || process.env.STANDALONE_MODE === 'true'

const providers = isStandaloneMode
  ? [
      CredentialsProvider({
        name: 'Email and Password',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await verifyCredentials(
            credentials.email as string,
            credentials.password as string
          )

          return user
        },
      }),
    ]
  : [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ]

export const authConfig: NextAuthConfig = {
  adapter: isStandaloneMode ? undefined : PrismaAdapter(db),
  providers,
  session: {
    strategy: isStandaloneMode ? 'jwt' : 'database',
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

      // In standalone mode with credentials, user is already verified
      if (isStandaloneMode) {
        return true
      }

      // OAuth mode: check allowlist
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
    async jwt({ token, user }) {
      // Standalone mode uses JWT
      if (user) {
        token.id = user.id
        token.role = user.role
        token.discipline = user.discipline
      }
      return token
    },
    async session({ session, token, user }) {
      if (isStandaloneMode) {
        // JWT mode
        if (session.user && token) {
          session.user.id = token.id as string
          session.user.role = token.role as AppRole
          session.user.discipline = token.discipline as string
        }
      } else {
        // Database mode
        if (session.user && user) {
          session.user.id = user.id
          const dbUser = await db.user.findUnique({
            where: { id: user.id },
          })

          if (dbUser) {
            session.user.role = dbUser.role
            session.user.discipline = dbUser.discipline
          } else {
            throw new Error('User not found in database during session callback.')
          }
        }
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
