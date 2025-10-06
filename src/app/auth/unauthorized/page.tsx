import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
          <CardDescription>
            Your email is not on the authorized clinician list
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Only authorized healthcare professionals can access this platform. If you believe this is an error, please contact your administrator.
          </p>
          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/sign-in">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
