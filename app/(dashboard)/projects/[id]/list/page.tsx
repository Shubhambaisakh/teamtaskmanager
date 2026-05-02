import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TaskListView } from '@/components/tasks/TaskListView'

export default async function ProjectListPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is a member and get role
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    notFound()
  }

  // Fetch tasks with assignee profiles
  const { data: tasksData } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      status,
      priority,
      due_date,
      assignee_id,
      profiles!tasks_assignee_id_fkey(
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  // Transform tasks to match expected format
  const tasks = (tasksData || []).map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.due_date,
    assignee: task.profiles ? {
      id: task.profiles.id,
      full_name: task.profiles.full_name,
      email: task.profiles.email,
      avatar_url: task.profiles.avatar_url,
    } : null,
  }))

  // Fetch project members for assignee dropdown
  const { data: membersData } = await supabase
    .from('project_members')
    .select(`
      user_id,
      profiles(full_name, email, avatar_url)
    `)
    .eq('project_id', id)

  // Transform members to match expected format
  const members = (membersData || []).map((member: any) => ({
    user_id: member.user_id,
    profiles: {
      full_name: member.profiles.full_name,
      email: member.profiles.email,
      avatar_url: member.profiles.avatar_url,
    },
  }))

  return (
    <TaskListView
      tasks={tasks}
      projectId={id}
      userRole={membership.role}
      currentUserId={user.id}
      members={members}
    />
  )
}
