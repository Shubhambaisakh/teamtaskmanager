import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectSettingsForm } from '@/components/projects/ProjectSettingsForm'
import { DeleteProjectButton } from '@/components/projects/DeleteProjectButton'

export default async function ProjectSettingsPage({
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

  // Verify user is an admin
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    notFound()
  }

  if (membership.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            You do not have permission to access project settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Fetch project details
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>
            Update project information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectSettingsForm project={project} />
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
              Delete Project
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Once you delete a project, there is no going back. All tasks, comments, and data will be permanently deleted.
            </p>
            <DeleteProjectButton projectId={id} projectName={project.name} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
