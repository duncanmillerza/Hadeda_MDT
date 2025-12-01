# 🚀 Quick Start Guide

## Prerequisites

- PostgreSQL running locally or remotely
- Google OAuth credentials
- Node.js 18+

---

## Step 1: Install Dependencies (Already Done ✅)

```bash
npm install
```

---

## Step 2: Configure Environment

Update `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hadedahealth_mdt"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth (Get from: https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## Step 3: Setup Database

```bash
# Run migration (creates all tables)
npm run db:migrate

# Seed sample data
npm run db:seed

# (Optional) generate Prisma client if schema changes
npx prisma generate
```

---

## Step 4: Add Yourself to Allow-List

**Option A: Using Prisma Studio (Recommended)**

```bash
npm run db:studio
```

Then:
1. Go to `ClinicianAllowlist` table
2. Click "Add record"
3. Fill in:
   - **email**: `your-google-email@gmail.com` (lowercase!)
   - **role**: `ADMIN`
   - **name**: `Your Name` (optional)
   - **discipline**: `Your Discipline` (optional)
4. Save

**Option B: Direct SQL**

```sql
INSERT INTO "ClinicianAllowlist" (id, email, role, name, "createdAt")
VALUES (gen_random_uuid(), 'your-email@gmail.com', 'ADMIN', 'Your Name', NOW());
```

---

## Step 5: Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

You'll be redirected to `/auth/sign-in` → Click "Continue with Google"

---

## ✅ Verify It Works

After signing in, you should:
1. ✅ See a redirect to `/mdt` (page doesn't exist yet, that's OK!)
2. ✅ Check your session in browser DevTools → Application → Cookies
3. ✅ Verify you're authenticated

---

## 🗄️ Explore Database

```bash
# Open Prisma Studio
npm run db:studio
```

Tables created:
- ✅ ClinicianAllowlist (your email should be here)
- ✅ User (created after first sign-in)
- ✅ Patient (5 sample patients from seed)
- ✅ MDTMeeting (empty)
- ✅ Task (empty)
- ✅ Note (empty)
- ✅ AuditLog (tracks all changes)

---

## 🧪 Test Server Actions

Create a test page to verify backend works:

**`src/app/test/page.tsx`**

```tsx
import { getPatients } from '@/app/actions/patients'

export default async function TestPage() {
  const patients = await getPatients()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <pre className="bg-muted p-4 rounded">
        {JSON.stringify(patients, null, 2)}
      </pre>
    </div>
  )
}
```

Visit: **http://localhost:3000/test**

Should see JSON of 5 patients from seed data.

---

## 📝 What's Next?

The backend is 100% functional. Build UI pages:

### Priority 1: MDT Page
**File:** `src/app/mdt/page.tsx`

```tsx
import { getPatients } from '@/app/actions/patients'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function MDTPage() {
  const activePatients = await getPatients('ACTIVE')
  const waitingAuth = await getPatients('WAITING_AUTH')
  const headway = await getPatients('HEADWAY')
  const discharged = await getPatients('DISCHARGED')

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MDT Patients</h1>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activePatients.length})</TabsTrigger>
          <TabsTrigger value="waiting">Waiting Auth ({waitingAuth.length})</TabsTrigger>
          <TabsTrigger value="headway">Headway ({headway.length})</TabsTrigger>
          <TabsTrigger value="discharged">Discharged ({discharged.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {/* Add DataTable component here */}
          <pre>{JSON.stringify(activePatients, null, 2)}</pre>
        </TabsContent>

        {/* Repeat for other tabs */}
      </Tabs>
    </div>
  )
}
```

### Priority 2: DataTable Component
Use the ShadCN Table component + TanStack Table for sorting/filtering

### Priority 3: Patient Detail Page
**File:** `src/app/patients/[id]/page.tsx`

```tsx
import { getPatient } from '@/app/actions/patients'

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await getPatient(params.id)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{patient?.fullName}</h1>
      {/* Add tabs for Notes, Tasks, Meetings */}
    </div>
  )
}
```

---

## 🛠️ Useful Commands

```bash
# Database
npm run db:migrate        # Run migrations
npm run db:studio         # Open Prisma Studio
npm run db:seed           # Seed data
npm run db:push           # Push schema changes (no migration)

# Development
npm run dev               # Start dev server
npm run build             # Production build
npm run start             # Start production server

# Code Quality
npm run lint              # ESLint
npm run typecheck         # TypeScript check
npm run test              # Run tests
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -d hadedahealth_mdt

# Or update DATABASE_URL in .env
```

### Google OAuth Error
1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Add `http://localhost:3000` to authorized redirect URIs in Google Console
3. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### Not on Allow-List Error
1. Check email is **lowercase** in ClinicianAllowlist table
2. Check you're signing in with the **same Google email**
3. Use `npm run db:studio` to verify

### Type Errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Check TypeScript
npm run typecheck
```

---

## 📚 Documentation

- **README.md** - Full setup guide
- **IMPLEMENTATION_PLAN.md** - Detailed roadmap
- **STATUS.md** - Current progress
- **WHAT_IS_DONE.md** - Complete feature list

---

**You're all set! The backend is ready. Now build the UI pages.** 🚀
