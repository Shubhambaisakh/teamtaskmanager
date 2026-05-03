import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
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

  // Fetch project with user's role
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members!inner(role)
    `)
    .eq('id', id)
    .eq('project_members.user_id', user.id)
    .single()

  if (error || !project) {
    notFound()
  }

  const userRole = project.project_members[0]?.role

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {project.name}
        </h1>
        {project.description && (
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {project.description}
          </p>
        )}
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList>
          <Link href={`/projects/${id}/board`}>
            <TabsTrigger value="board">Board</TabsTrigger>
          </Link>
          <Link href={`/projects/${id}/list`}>
            <TabsTrigger value="list">List</TabsTrigger>
          </Link>
          <Link href={`/projects/${id}/members`}>
            <TabsTrigger value="members">Members</TabsTrigger>
          </Link>
          {userRole === 'admin' && (
            <Link href={`/projects/${id}/settings`}>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </Link>
          )}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
