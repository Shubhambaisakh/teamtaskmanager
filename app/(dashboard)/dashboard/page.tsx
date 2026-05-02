import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

      {/* Stats cards will be implemented in Task 13 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Tasks</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Due Today</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
        </div>
      </div>

      {/* My Tasks section will be implemented in Task 13 */}
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          My Tasks
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You're all caught up! No tasks assigned to you.
        </p>
      </div>
    </div>
  )
}
