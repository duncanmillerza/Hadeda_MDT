import { TaskTable, type TaskRow } from '@/app/tasks/_components/task-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function buildMockTask(overrides: Partial<TaskRow>): TaskRow {
  const base: TaskRow = {
    id: 'mock',
    title: 'Task',
    description: null,
    priority: 'MEDIUM',
    status: 'OPEN',
    dueDate: null,
    patientId: null,
    meetingItemId: null,
    assignedToId: null,
    createdById: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    patient: null,
    assignedTo: null,
    createdBy: {
      id: 'user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'CLINICIAN',
      createdAt: new Date(),
      updatedAt: new Date(),
      discipline: null,
      image: null,
      tasksAssigned: [],
      tasksCreated: [],
      notes: [],
      assignments: [],
    } as any,
  }

  return { ...base, ...overrides }
}

const mockTasks: TaskRow[] = [
  buildMockTask({
    id: 'mock-1',
    title: 'Follow up with physiotherapist',
    description: 'Schedule progress review and update MDT notes.',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: new Date(),
    patient: {
      id: 'patient-1',
      fullName: 'John Doe',
      status: 'ACTIVE',
      disciplines: ['Physiotherapy'],
      authLeft: null,
      age: 45,
      diagnosis: 'Back injury',
      modality: 'F2F',
      lastMeetingComment: null,
      medicalAid: 'Discovery',
      startDate: null,
      socialWork: null,
      doctor: null,
      psychology: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      meetingItems: [],
      notes: [],
      tasks: [],
      assignments: [],
    } as any,
    assignedTo: {
      id: 'user-2',
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
      discipline: null,
      image: null,
      tasksAssigned: [],
      tasksCreated: [],
      notes: [],
      assignments: [],
    } as any,
  }),
  buildMockTask({
    id: 'mock-2',
    title: 'Update insurance authorization',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
  }),
]

export default function DemoResponsiveTablePage() {
  return (
    <div className="container space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Responsive table demo</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskTable data={mockTasks} searchPlaceholder="Search mock tasks…" />
        </CardContent>
      </Card>
    </div>
  )
}
