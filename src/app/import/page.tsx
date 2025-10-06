import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImportUploader } from './_components/import-uploader'

export default function ImportPage() {
  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Import patients</h1>
        <p className="text-sm text-muted-foreground">
          Upload the latest MDT spreadsheet to refresh patient cohorts.
        </p>
      </div>

      <ImportUploader />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Preview mode lets you verify sheet detection and sample rows before importing.</p>
          <p>• Confirm import will upsert patients by name + status and log outcomes to the audit trail.</p>
          <p>• Errors remain available in the audit log so you can correct rows and retry.</p>
        </CardContent>
      </Card>
    </div>
  )
}
