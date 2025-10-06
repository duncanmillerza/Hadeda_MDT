# HadedaHealth MDT Meeting App

A production-ready Multi-Disciplinary Team (MDT) meeting management platform built with Next.js 15, Prisma, and NextAuth.

## Features

- 🔐 **Google OAuth Authentication** with email allow-list enforcement
- 📊 **Patient Management** with 4 status categories (Active, Discharged, Waiting Auth, Headway)
- 📅 **MDT Meeting Workflows** with agenda items, notes, and task assignment
- 📝 **Notes & Tasks** with RBAC (Role-Based Access Control)
- 📥 **XLSX Import** - Robust Excel file import with preview and batch processing
- 🔍 **Audit Logging** - Complete tracking of all mutations for compliance
- 🎨 **Design System** - Reuses HadedaHealth design tokens and components
- ♿ **Accessibility** - WCAG AA compliant with full keyboard navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + ShadCN/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth v5 (Google OAuth)
- **Validation**: Zod + react-hook-form
- **State**: Server Actions + TanStack Query
- **Testing**: Vitest + Testing Library

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/apis/credentials))

## Getting Started

### 1. Clone and Install

```bash
cd hadedahealth-mdt
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hadedahealth_mdt"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

### 4. Add Yourself to Allow-List

Before you can sign in, add your Google email to the allow-list:

```bash
npx prisma studio
```

Then manually add a record to `ClinicianAllowlist` table with:
- **email**: your-email@gmail.com (lowercase)
- **role**: ADMIN
- **name**: Your Name (optional)

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with Google.

## Project Structure

```
hadedahealth-mdt/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── actions/           # Server Actions
│   │   ├── api/auth/          # NextAuth API
│   │   ├── auth/              # Auth pages
│   │   ├── mdt/               # MDT page (TODO)
│   │   ├── patients/          # Patient pages (TODO)
│   │   ├── meetings/          # Meeting pages (TODO)
│   │   ├── tasks/             # Tasks (TODO)
│   │   └── import/            # XLSX import (TODO)
│   ├── components/
│   │   ├── ui/                # ShadCN components
│   │   └── providers.tsx      # Providers
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── auth.ts            # NextAuth config
│       ├── import/            # XLSX import
│       └── validations/       # Zod schemas
└── IMPLEMENTATION_PLAN.md     # Roadmap
```

## RBAC - Role-Based Access

- **VIEWER**: Read-only
- **CLINICIAN**: Create notes/tasks
- **MANAGER**: + Team tasks
- **ADMIN**: + Allowlist + Delete

## XLSX Import Format

### Sheets
- `Active PTS` → ACTIVE
- `DC patients` → DISCHARGED
- `waiting for auth` → WAITING_AUTH
- `Headway patients` → HEADWAY

### Columns
- `Name` → Full name
- `Age` → Integer
- `Dx` → Diagnosis
- `Disciplines` → Split by `/,;`
- `MA` → Medical aid
- etc.

## Development

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npx prisma studio    # Database GUI
```

## See IMPLEMENTATION_PLAN.md for full roadmap

---

**Built for HadedaHealth**
