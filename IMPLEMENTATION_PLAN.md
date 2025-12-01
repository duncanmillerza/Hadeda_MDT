# HadedaHealth MDT Meeting App - Implementation Plan

## 🌟 STANDALONE MODE - Current Branch

This branch contains the **standalone, offline-first version** of the MDT app designed to run entirely on a local machine without cloud dependencies.

### Key Differences from Main Branch:
- ✅ **SQLite** database instead of PostgreSQL
- ✅ **Local authentication** (email/password) instead of Google OAuth
- ✅ **One-click startup** scripts for Mac and Windows
- ✅ **Self-contained** - all data stored locally in `/data` folder
- ✅ **Dual-mode support** - can run in cloud mode OR standalone mode

---

## ✅ Completed Features

### Phase 1: Foundation & Setup
- [x] Next.js 15 with TypeScript, Tailwind CSS, ESLint
- [x] Dependencies: Prisma, NextAuth, ShadCN/ui, ExcelJS, Zod, React Query, bcryptjs
- [x] 18 ShadCN components installed
- [x] Complete Prisma schema (10 models) - **SQLite compatible**
- [x] Environment variables (.env, .env.example)
- [x] Design system copied from HadedaHealth frontend

### Phase 2: Authentication & Security (STANDALONE MODE)
- [x] **Dual-mode authentication system**:
  - Google OAuth (cloud mode)
  - Local credentials with bcrypt (standalone mode)
- [x] JWT session strategy for standalone mode
- [x] Database session strategy for cloud mode
- [x] Allow-list enforcement (`/src/lib/allowlist.ts`)
- [x] Route protection middleware (`/src/middleware.ts`)
- [x] Audit log service (`/src/lib/audit-log.ts`)
- [x] Local auth helper (`/src/lib/auth-local.ts`)
- [x] User creation script (`scripts/create-user.ts`)

### Phase 3: Database (STANDALONE MODE)
- [x] **SQLite database** with local file storage
- [x] Migrations created and tested (`/prisma/migrations/`)
- [x] Seed script updated for SQLite compatibility
- [x] Disciplines field stored as JSON string (SQLite doesn't support arrays)
- [x] Helper functions for disciplines conversion (`/src/lib/disciplines-helper.ts`)
- [x] Database stored in `/data/mdt.db`

### Phase 4: Core Services & Validation
- [x] Database client (`/src/lib/db.ts`)
- [x] XLSX parser with header normalization (`/src/lib/import/parse-xlsx.ts`)
- [x] Patient import service with batching (`/src/lib/import/import-patients.ts`)
- [x] Validation schemas with SQLite transforms (`/src/lib/validations/`)
- [x] All Server Actions:
  - `/src/app/actions/patients.ts` - Patient CRUD + import
  - `/src/app/actions/meetings.ts` - Meeting & agenda management
  - `/src/app/actions/tasks.ts` - Task CRUD with RBAC
  - `/src/app/actions/notes.ts` - Note CRUD with revalidation
  - `/src/app/actions/allowlist.ts` - Admin allowlist management

### Phase 5: User Interface
- [x] **Authentication Pages**:
  - `/src/app/auth/sign-in/page.tsx` - Dual-mode sign-in (OAuth OR credentials)
  - `/src/app/auth/unauthorized/page.tsx` - Access denied
  - `/src/app/auth/error/page.tsx` - Auth errors
  - Root layout with SessionProvider and QueryClient

- [x] **Core Components**:
  - `/src/components/data-table.tsx` - Reusable data table
  - `/src/app/mdt/_components/patient-row-actions.tsx` - Patient actions sheet
  - `/src/app/mdt/_components/meeting-item-card.tsx` - Meeting agenda cards
  - `/src/app/mdt/_components/forms/task-form.tsx` - Task creation
  - `/src/app/mdt/_components/forms/note-form.tsx` - Note creation
  - `/src/components/providers.tsx` - Context providers

- [x] **Main Pages**:
  - `/src/app/mdt/page.tsx` - MDT overview with 4 status tabs
  - `/src/app/patients/page.tsx` - Patient list
  - `/src/app/patients/[id]/page.tsx` - Patient detail view
  - `/src/app/meetings/page.tsx` - Meetings list
  - `/src/app/meetings/[id]/page.tsx` - Meeting agenda view
  - `/src/app/tasks/page.tsx` - Task management (My Tasks + Team Tasks)
  - `/src/app/import/page.tsx` - XLSX import interface
  - `/src/app/admin/allowlist/page.tsx` - User management (ADMIN only)

### Phase 6: Standalone Deployment
- [x] **Startup Scripts**:
  - `start-mdt.sh` - Mac/Linux launcher
  - `start-mdt.bat` - Windows launcher
  - Auto-browser opening
  - First-time setup automation
  - Dependency installation
  - Database initialization

- [x] **Documentation**:
  - `README_STANDALONE.md` - Complete standalone guide
  - Setup instructions for Mac and Windows
  - User creation guide
  - Backup/restore procedures
  - Troubleshooting section
  - Network access configuration

- [x] **Configuration**:
  - `.env` updated for standalone mode
  - `STANDALONE_MODE="true"` flag
  - SQLite connection string
  - Local-only settings

---

## 🔧 In Progress

### TypeScript Compatibility Fixes
- [~] Update remaining components to use `disciplinesToArray()` helper:
  - `/src/app/patients/[id]/page.tsx`
  - `/src/app/meetings/[id]/page.tsx`
- [~] Fix auth type declarations for JWT mode
- [~] Resolve any remaining build errors

---

## 📋 Optional Enhancements

### Phase 7: Testing & Quality (Not Required for Standalone)
- [ ] Vitest configuration
- [ ] Component tests
- [ ] E2E tests
- [ ] Husky pre-commit hooks

### Phase 8: Advanced Features (Future)
- [ ] Patient edit form (`/src/app/patients/[id]/edit/page.tsx`)
- [ ] Bulk user import
- [ ] Export to PDF/Excel
- [ ] Data visualization dashboard
- [ ] Email notifications (local SMTP)

---

## 🔑 Technical Details (Standalone Mode)

### Database: SQLite
```
Location: /data/mdt.db
Type: SQLite 3
Migrations: /prisma/migrations/
Backups: Copy /data/ folder
```

### Authentication Flow
```
1. User opens app (./start-mdt.sh or start-mdt.bat)
2. Browser opens to localhost:3000
3. User enters email/password
4. Credentials verified via bcrypt
5. JWT session created
6. User redirected to /mdt
```

### Data Storage
```
/data/
├── mdt.db              # Main database
├── mdt.db-journal      # SQLite journal (auto-created)
└── mdt.db-wal          # Write-ahead log (auto-created)
```

### Disciplines Field Handling
Since SQLite doesn't support arrays, disciplines are stored as JSON strings:

**Database**: `"[\"Physiotherapy\",\"Occupational Therapy\"]"`
**Application**: `["Physiotherapy", "Occupational Therapy"]`

Use helper functions:
- `disciplinesToString(array)` - Convert array to JSON string for DB
- `disciplinesToArray(string)` - Parse JSON string to array for UI

### XLSX Import Mapping
```
Sheet Name → Patient Status:
- "Active PTS" → ACTIVE
- "DC patients" → DISCHARGED
- "waiting for auth" → WAITING_AUTH
- "Headway patients" → HEADWAY

Column Mapping:
- "Name" → fullName
- "Age" → age (int)
- "Dx" → diagnosis
- "Date starting OPD" → startDate (date)
- "MA" → medicalAid
- "Disciplines" → disciplines (JSON string)
- "F2F/ HBR" or "F2F/HBR" → modality
- "Auth update 23/09" or "Auth left" → authLeft
- "Social Work" → socialWork
- "Doctor" → doctor
- "Psychology" → psychology
- "Comments from last team meeting" → lastMeetingComment
```

### RBAC Rules
- **VIEWER**: Read-only access
- **CLINICIAN**: Create notes/tasks, view patients, participate in meetings
- **MANAGER**: All clinician permissions + view team tasks
- **ADMIN**: All permissions + user management, delete operations

### Design System
- Semantic tokens from `/src/lib/styles/utils.ts`
- HadedaHealth design patterns
- WCAG AA compliance
- Mobile-first responsive design

---

## 📝 Standalone Mode Checklist

- [x] SQLite database configured and migrated
- [x] Local authentication implemented
- [x] Startup scripts created (Mac + Windows)
- [x] User creation script working
- [x] Database seeding successful
- [x] All pages functional
- [x] All server actions working
- [x] XLSX import operational
- [~] TypeScript compilation clean (minor fixes pending)
- [x] Documentation complete (README_STANDALONE.md)
- [ ] Tested on Mac
- [ ] Tested on Windows

---

## 🚀 Quick Start (Standalone Mode)

### Mac/Linux:
```bash
./start-mdt.sh
```

### Windows:
```
start-mdt.bat
```

### Manual Setup:
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:migrate -- --name init
npm run db:seed

# 3. Create admin user
npm run create-user

# 4. Start server
npm run dev
```

### Create Additional Users:
```bash
npm run create-user
```

### Database Management:
```bash
npm run db:studio    # Visual database browser
npm run db:seed      # Reset with sample data
npm run db:migrate   # Apply schema changes
```

---

## 📊 Project Status

**Branch**: `standalone`
**Mode**: Offline-first, local deployment
**Database**: SQLite (local file)
**Authentication**: Email/Password (local)
**Deployment**: Double-click launcher scripts

**Overall Progress**: ~95% complete

**Remaining Work**:
1. Fix TypeScript errors (2-3 files)
2. Test on Mac and Windows
3. Final polish and bug fixes

---

## 🔄 Switching Between Modes

The app supports both cloud and standalone modes via environment variables:

**Standalone Mode** (current):
```env
DATABASE_URL="file:./data/mdt.db"
STANDALONE_MODE="true"
NEXT_PUBLIC_STANDALONE_MODE="true"
# No GOOGLE_CLIENT_ID needed
```

**Cloud Mode**:
```env
DATABASE_URL="postgresql://..."
STANDALONE_MODE="false"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-secret"
```

---

**Last Updated**: December 1, 2025
**Status**: Standalone mode functional, minor TypeScript fixes pending
**Branch**: `standalone`
**Version**: 1.0.0-standalone
