import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTaskSchema } from '@/lib/validations/task.schema'
import { createNotification } from '@/lib/notifications'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createTaskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      )
    }

    // Check if user is admin of the project or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)
    
    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', validation.data.project_id)
      .eq('user_id', user.id)
      .single()

    if (!globalAdmin && (!membership || membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        project_id: validation.data.project_id,
        title: validation.data.title,
        description: validation.data.description,
        status: validation.data.status,
        priority: validation.data.priority,
        assignee_id: validation.data.assignee_id,
        due_date: validation.data.due_date,
      })
      .select()
      .single()

    if (taskError) {
      console.error('Error creating task:', taskError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Create notification if task is assigned
    if (validation.data.assignee_id && validation.data.assignee_id !== user.id) {
      await createNotification(validation.data.assignee_id, 'task_assigned', task.id)
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
