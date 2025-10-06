import { getMyTasks, getTeamTasks } from '@/app/actions/tasks'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TaskTable, type TaskRow } from './_components/task-table'

export default async function TasksPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="container space-y-6 py-8">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Sign in to view your tasks.
          </CardContent>
        </Card>
      </div>
    )
  }

  const myTasks = (await getMyTasks()) as TaskRow[]

  let teamTasks: TaskRow[] = []
  let teamError: string | null = null
  try {
    teamTasks = (await getTeamTasks()) as TaskRow[]
  } catch (error) {
    teamError = 'Team tasks require manager or admin access.'
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Track your assigned actions and, if you have permission, your team’s workload.
          </p>
        </div>
        <Badge variant="outline">Total {myTasks.length + (teamTasks?.length ?? 0)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Task overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my" className="space-y-4">
            <TabsList>
              <TabsTrigger value="my">My Tasks ({myTasks.length})</TabsTrigger>
              <TabsTrigger value="team" disabled={!!teamError}>
                Team Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my">
              <TaskTable data={myTasks} searchPlaceholder="Search my tasks…" />
            </TabsContent>

            <TabsContent value="team">
              {teamError ? (
                <Card>
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    {teamError}
                  </CardContent>
                </Card>
              ) : (
                <TaskTable data={teamTasks} searchPlaceholder="Search team tasks…" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
