import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectsList } from '@/components/projects/ProjectsList'

export default async function ProjectsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for global role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Fetch projects directly from Supabase
  const { data: projects, error } = await supabase
    .from('project_members')
    .select(`
      role,
      projects (
        id,
        name,
        description,
        archived_at,
        created_at,
        tasks (
          id,
          status
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { foreignTable: 'projects', ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  // Transform the data to match expected format
  const projectsData = projects?.map((pm: any) => {
    const project = pm.projects
    const totalTasks = project.tasks?.length || 0
    const doneTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0
    
    return {
      ...project,
      role: pm.role,
      task_count: totalTasks,
      done_count: doneTasks,
    }
  }) || []

  return <ProjectsList projects={projectsData} globalRole={profile?.role || 'member'} />
}
