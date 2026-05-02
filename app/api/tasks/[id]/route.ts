import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateTaskSchema, updateStatusSchema } from '@/lib/validations/task.schema'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get task with assignee profile and comment count
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url),
        comments(count)
      `)
      .eq('id', id)
      .single()

    if (error || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Verify user is a member of the project
    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...task,
      comment_count: task.comments[0]?.count || 0,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get task to check permissions
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('project_id, assignee_id')
      .eq('id', id)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check user's role in the project
    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const body = await request.json()

    // If user is admin, allow all updates
    if (membership.role === 'admin') {
      const validation = updateTaskSchema.safeParse(body)

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

      const { data: updatedTask, error: updateError } = await supabase
        .from('tasks')
        .update(validation.data)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating task:', updateError)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }

      return NextResponse.json(updatedTask)
    }

    // If user is member, only allow status updates on assigned tasks
    if (task.assignee_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only update tasks assigned to you' },
        { status: 403 }
      )
    }

    // Validate status-only update
    const validation = updateStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Members can only update task status',
          details: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      )
    }

    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ status: validation.data.status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating task:', updateError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get task to check permissions
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', id)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user is admin
    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting task:', deleteError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
