# HadedaHealth MDT Meeting App - Implementation Plan

## ✅ Completed (Current Progress)

### Phase 1: Foundation & Setup
- [x] Next.js 15 with TypeScript, Tailwind CSS, ESLint
- [x] Dependencies: Prisma, NextAuth, ShadCN/ui, ExcelJS, Zod, React Query
- [x] 18 ShadCN components installed
- [x] Complete Prisma schema (10 models)
- [x] Environment variables (.env, .env.example)
- [x] Design system copied from HadedaHealth frontend

### Phase 2: Authentication & Security
- [x] NextAuth with Google OAuth (database session strategy)
- [x] Allow-list enforcement (`/src/lib/allowlist.ts`)
- [x] Route protection middleware (`/src/middleware.ts`)
- [x] Audit log service (`/src/lib/audit-log.ts`)
- [x] Auth configuration (`/src/lib/auth.ts`)
- [x] Prisma schema updated with Auth.js adapter models

### Phase 3: Core Services & Validation
- [x] Database client (`/src/lib/db.ts`)
- [x] XLSX parser with header normalization (`/src/lib/import/parse-xlsx.ts`)
- [x] Patient import service with batching (`/src/lib/import/import-patients.ts`)
- [x] Validation schemas: Patient, Task, Note, Meeting (`/src/lib/validations/`)
- [x] Patient Server Actions (`/src/app/actions/patients.ts`)

## 📋 TODO: Remaining Implementation

### Phase 4: Authentication Pages
- [x] `/src/app/auth/sign-in/page.tsx` - Google sign-in page
- [x] `/src/app/auth/unauthorized/page.tsx` - Access denied page
- [x] `/src/app/auth/error/page.tsx` - Auth error page
- [x] Root layout with SessionProvider and QueryClient providers

### Phase 5: Server Actions
- [x] `/src/app/actions/patients.ts` - Upsert + audit logging
- [x] `/src/app/actions/meetings.ts` - Meeting + agenda management
- [x] `/src/app/actions/tasks.ts` - Task CRUD with RBAC checks
- [x] `/src/app/actions/notes.ts` - Note CRUD with revalidation
- [ ] `/src/app/actions/allowlist.ts` - Admin CRUD for allowlist
- [ ] `/src/app/api/import/route.ts` - XLSX upload & import API

### Phase 6: Core Components
- [x] `/src/components/data-table.tsx` - Reusable data table with sorting/filtering
- [x] `/src/components/patient-row-actions.tsx` - Discuss sheet with meeting add + task/note forms
- [~] `/src/components/meeting-item-card.tsx` - Agenda card with status/outcome (note/task lists pending)
- [x] `/src/components/task-form.tsx` - Create/edit task dialog
- [x] `/src/components/note-editor.tsx` - Note creation form (dialog variant)
- [x] `/src/components/providers.tsx` - Session & QueryClient providers

### Phase 7: Main Pages

#### MDT Page
- [~] `/src/app/mdt/page.tsx` - Main MDT page with tabs + discuss sheet (meeting cards/tasks pending)
  - Active, Waiting Auth, Headway, Discharged tabs
  - DataTable per tab
  - Columns: Name, Dx, Disciplines (badges), Modality, Auth, Last Comment, Actions
  - Row actions: "Discuss" sheet, "View" link

#### Patients
- [~] `/src/app/patients/page.tsx` - Patient list with search/filter (actions pending)
- [~] `/src/app/patients/[id]/page.tsx` - Patient detail with tabs (content stubs pending)
  - Notes tab
  - Tasks tab
  - Meetings tab
- [ ] `/src/app/patients/[id]/edit/page.tsx` - Edit patient form (optional)

#### Meetings
- [~] `/src/app/meetings/page.tsx` - Meetings list (create dialog pending)
- [~] `/src/app/meetings/[id]/page.tsx` - Meeting agenda view (task/note lists pending)
  - Agenda item cards with status badges
  - Notes section per item
  - Tasks section per item
  - Outcome field

#### Tasks
- [~] `/src/app/tasks/page.tsx` - Task management (create/update flows pending)
  - "My Tasks" tab (filtered by current user)
  - "Team Tasks" tab (manager/admin only)
  - Filtering by status, priority, patient

#### Import
- [~] `/src/app/import/page.tsx` - XLSX upload & preview (post-import UX pending)
  - File upload dropzone
  - Preview tables (first 20 rows per sheet)
  - Confirm import button
  - Import results display

#### Admin
- [x] `/src/app/admin/allowlist/page.tsx` - Allowlist management (ADMIN only)
  - CRUD table for allowlist entries (bulk import pending)

### Phase 8: Database & Testing
- [ ] Run `npx prisma migrate dev --name init`
- [x] `/prisma/seed.ts` with sample data (allowlist + patients)
- [ ] Run `npm run db:seed`

### Phase 9: Testing Setup
- [ ] `/vitest.config.ts` - Vitest configuration
- [ ] `/.eslintrc.json` - ESLint config
- [ ] `/.prettierrc` - Prettier config
- [ ] `/package.json` - Add test scripts
- [ ] Husky pre-commit hooks (`npx husky init`)
- [ ] Sample component tests

### Phase 10: Documentation
- [ ] Update `/README.md` with setup instructions
- [ ] Document environment variables
- [ ] Add architecture overview
- [ ] Deployment guide

## 🔑 Key Technical Details

### XLSX Import Mapping
```
Sheet Name → Patient Status:
- "Active PTS" → ACTIVE
- "DC patients" → DISCHARGED
- "waiting for auth" → WAITING_AUTH
- "Headway patients" → HEADWAY

Column Mapping:
- " Name" → fullName
- "Age" → age (int)
- "Dx" → diagnosis
- "Date starting OPD" → startDate (date)
- "MA" → medicalAid
- "Disciplines" → disciplines[] (split by /, comma, semicolon)
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
- **ADMIN**: All permissions + allowlist management, delete operations

### Design System
- Use semantic tokens from `/src/lib/styles/utils.ts`
- Follow patterns from HadedaHealth frontend
- WCAG AA compliance (focus states, ARIA labels)
- Mobile-first responsive design

## 📝 Definition of Done Checklist
- [x] Google sign-in with allow-list enforced
- [ ] XLSX importer ingests all 4 sheets correctly (parser ready, API/UI pending)
- [ ] Patients grouped by status with MDT workflow
- [ ] Notes and tasks creation/assignment working end-to-end
- [ ] "My Tasks" vs "Team Tasks" (RBAC)
- [x] Audit log captures all mutations
- [ ] UI follows HadedaHealth design system exactly
- [ ] WCAG AA accessibility standards met
- [ ] Database migrations successful
- [ ] Seed data populates test environment
- [ ] Documentation complete

## 🚀 Next Immediate Steps
1. Build patient row actions sheet + meeting item card components for MDT interactions
2. Scaffold patient, meeting, task, import, and admin pages
3. Implement remaining client forms (task/note) and integrate server actions
4. Wire `/api/import` into UI with preview + confirmation flow
5. Run Prisma migration + seed locally, document verification steps
6. Start component/tests scaffolding (Vitest, RTL, API tests)

---

**Last Updated**: 2025-02-15
**Status**: Backend actions restored; UI implementation now unblocked
