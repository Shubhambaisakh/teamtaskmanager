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
  const { data: projectData, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members!inner(role)
    `)
    .eq('id', id)
    .eq('project_members.user_id', user.id)
    .single()

  // Fetch global profile for super-admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !projectData) {
    notFound()
  }

  const isGlobalAdmin = profile?.role === 'admin'
  const isProjectAdmin = projectData.project_members[0]?.role === 'admin'
  const canManageProject = isGlobalAdmin || isProjectAdmin

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {projectData.name}
        </h1>
        {projectData.description && (
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {projectData.description}
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
          {canManageProject && (
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
