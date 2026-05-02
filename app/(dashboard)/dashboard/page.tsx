import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { MyTasksList } from '@/components/dashboard/MyTasksList'
import { ProjectProgressList } from '@/components/dashboard/ProjectProgressList'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch dashboard statistics
  const [projectsResult, tasksResult, todayTasksResult, overdueTasksResult, completedThisWeekResult] = await Promise.all([
    // Total projects count
    supabase
      .from('project_members')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    
    // Total assigned tasks count
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('assignee_id', user.id)
      .neq('status', 'done'),
    
    // Tasks due today
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('assignee_id', user.id)
      .eq('due_date', new Date().toISOString().split('T')[0])
      .neq('status', 'done'),
    
    // Overdue tasks
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('assignee_id', user.id)
      .lt('due_date', new Date().toISOString().split('T')[0])
      .neq('status', 'done'),
    
    // Tasks completed this week
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('assignee_id', user.id)
      .eq('status', 'done')
      .gte('completed_at', getStartOfWeek().toISOString()),
  ])

  const stats = {
    totalProjects: projectsResult.count || 0,
    assignedTasks: tasksResult.count || 0,
    dueToday: todayTasksResult.count || 0,
    overdue: overdueTasksResult.count || 0,
    completedThisWeek: completedThisWeekResult.count || 0,
  }

  // Fetch user's assigned tasks with project info
  const { data: myTasks } = await supabase
    .from('tasks')
    .select(`
      *,
      projects(id, name)
    `)
    .eq('assignee_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(10)

  // Fetch user's projects with progress
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      tasks(id, status)
    `)
    .eq('project_members.user_id', user.id)
    .is('archived_at', null)
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here's an overview of your tasks and projects.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyTasksList tasks={myTasks || []} />
        <ProjectProgressList projects={projects || []} />
      </div>
    </div>
  )
}

function getStartOfWeek(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust for Sunday
  return new Date(now.setDate(diff))
}
