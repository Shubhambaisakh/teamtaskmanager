'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectProgressBar } from '@/components/projects/ProjectProgressBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { FolderKanban } from 'lucide-react'

interface Project {
  id: string
  name: string
  tasks: Array<{
    id: string
    status: 'todo' | 'in_progress' | 'in_review' | 'done'
  }>
}

interface ProjectProgressListProps {
  projects: Project[]
}

export function ProjectProgressList({ projects }: ProjectProgressListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create a project to start tracking progress."
          />
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const totalTasks = project.tasks.length
              const doneTasks = project.tasks.filter(t => t.status === 'done').length
              const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}/board`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {project.name}
                      </h4>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {doneTasks}/{totalTasks} tasks
                      </span>
                    </div>
                    <ProjectProgressBar progress={progress} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
