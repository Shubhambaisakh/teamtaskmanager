import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Search projects (user must be a member)
    const { data: projects } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        project_members!inner(user_id)
      `)
      .eq('project_members.user_id', user.id)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5)

    // Search tasks (user must be a project member)
    const { data: tasks } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        project_id,
        projects!inner(
          id,
          name,
          project_members!inner(user_id)
        )
      `)
      .eq('projects.project_members.user_id', user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10)

    return NextResponse.json({
      projects: projects || [],
      tasks: tasks || [],
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
