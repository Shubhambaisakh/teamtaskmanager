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

  // Fetch global profile for super-admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isGlobalAdmin = profile?.role === 'admin'

  if (!membership && !isGlobalAdmin) {
    notFound()
  }

  // Use global admin role or project-specific role
  const effectiveRole = isGlobalAdmin ? 'admin' : (membership?.role || 'member')

  // Fetch all tasks for this project with assignee info
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  // Fetch project members for assignee dropdown
  const { data: membersData } = await supabase
    .from('project_members')
    .select(`
      user_id,
      role,
      profiles!project_members_user_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('project_id', id)

  // Transform the data to match expected type
  const members = membersData?.map(m => ({
    user_id: m.user_id,
    role: m.role,
    profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
  })) || []

  return (
    <KanbanBoard
      projectId={id}
      tasks={tasks || []}
      members={members}
      userRole={effectiveRole}
      currentUserId={user.id}
    />
  )
}
