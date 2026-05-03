import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProjectSchema } from '@/lib/validations/project.schema'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all projects where user is a member
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members!inner(role),
        tasks(id, status)
      `)
      .eq('project_members.user_id', user.id)
      .is('archived_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Calculate task counts for each project
    const projectsWithStats = projects.map((project) => {
      const tasks = project.tasks || []
      const totalTasks = tasks.length
      const doneTasks = tasks.filter((task: any) => task.status === 'done').length

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        created_at: project.created_at,
        updated_at: project.updated_at,
        role: project.project_members[0]?.role,
        task_count: totalTasks,
        done_count: doneTasks,
      }
    })

    return NextResponse.json(projectsWithStats)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a global admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Only admins can create projects' }, { status: 403 })
    }

    const body = await request.json()
    const validation = createProjectSchema.safeParse(body)

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

    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()

    // Insert project using admin client to ensure we get the ID back and bypass RLS
    const { data: project, error: projectError } = await adminSupabase
      .from('projects')
      .insert({
        name: validation.data.name,
        description: validation.data.description,
      })
      .select()
      .single()

    if (projectError) {
      console.error('Error creating project:', projectError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Add creator as admin using admin client
    const { error: memberError } = await adminSupabase
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: user.id,
        role: 'admin',
      })

    if (memberError) {
      console.error('Error adding project member:', memberError)
      // Rollback: delete the project using admin client
      await adminSupabase.from('projects').delete().eq('id', project.id)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
