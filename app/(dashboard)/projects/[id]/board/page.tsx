import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'

export default async function ProjectBoardPage({
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

  // Fetch all tasks for this project with assignee info
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  return (
    <KanbanBoard
      projectId={id}
      tasks={tasks || []}
      userRole={membership.role}
      currentUserId={user.id}
    />
  )
}
