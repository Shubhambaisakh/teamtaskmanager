import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

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

  // Verify user is a member
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    notFound()
  }

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Kanban Board View
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          This feature will be implemented in Phase 5 - Task 10
        </p>
      </CardContent>
    </Card>
  )
}
