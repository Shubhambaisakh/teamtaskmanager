import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateProjectSchema } from '@/lib/validations/project.schema'

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

    // Check if user is a member or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)

    // Get project with member details
    const query = supabase
      .from('projects')
      .select(`
        *,
        project_members(
          id,
          role,
          joined_at,
          user_id,
          profiles(full_name, email, avatar_url)
        )
      `)
      .eq('id', id)

    // If not global admin, only show if they are a member
    if (!globalAdmin) {
      query.eq('project_members.user_id', user.id)
    }

    const { data: project, error } = await query.single()

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
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

    // Check if user is admin or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)

    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single()

    if (!globalAdmin && (!membership || membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updateProjectSchema.safeParse(body)

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

    const { data: project, error } = await supabase
      .from('projects')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(project)
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

    // Check if user is admin or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)

    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single()

    if (!globalAdmin && (!membership || membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
