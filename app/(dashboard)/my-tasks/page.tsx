import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MyTasksList } from '@/components/dashboard/MyTasksList'

export default async function MyTasksPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all user's assigned tasks
  const { data: myTasks } = await supabase
    .from('tasks')
    .select(`
      *,
      projects(id, name)
    `)
    .eq('assignee_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Tasks
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          All tasks assigned to you across all projects
        </p>
      </div>

      <MyTasksList tasks={myTasks || []} />
    </div>
  )
}
