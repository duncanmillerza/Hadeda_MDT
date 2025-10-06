import { listAllowlist } from '@/app/actions/allowlist'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AllowlistTable } from './_components/allowlist-table'

export const metadata = {
  title: 'Allowlist • HadedaHealth MDT',
}

export default async function AllowlistPage() {
  const entries = await listAllowlist()

  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Clinician allowlist</h1>
        <p className="text-sm text-muted-foreground">
          Manage who can sign into the MDT platform through Google authentication.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Authorized emails</CardTitle>
        </CardHeader>
        <CardContent>
          <AllowlistTable entries={entries} />
        </CardContent>
      </Card>
    </div>
  )
}
