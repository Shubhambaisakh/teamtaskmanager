'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectProgressBar } from '@/components/projects/ProjectProgressBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { FolderKanban, ArrowRight } from 'lucide-react'

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
    <Card className="bg-[#111118] border-white/[0.07]">
      <CardHeader>
        <CardTitle className="text-[#E8E8F0] flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-[#00BFA5]" />
          Project Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create a project to start tracking progress."
          />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const totalTasks = project.tasks?.length || 0
              const doneTasks = project.tasks?.filter(t => t.status === 'done').length || 0
              const inProgressTasks = project.tasks?.filter(t => t.status === 'in_progress').length || 0
              const inReviewTasks = project.tasks?.filter(t => t.status === 'in_review').length || 0
              const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}/board`}
                  className="block group"
                >
                  <div className="p-4 rounded-lg bg-[#16161F] border border-white/[0.07] hover:border-[#00BFA5]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00BFA5]/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#E8E8F0] group-hover:text-[#00BFA5] transition-colors flex items-center gap-2">
                        {project.name}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <span className="text-xs font-medium text-white/40">
                        {doneTasks}/{totalTasks} tasks
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <ProjectProgressBar progress={progress} />
                    </div>

                    {/* Task Status Breakdown */}
                    <div className="flex items-center gap-3 text-xs">
                      {doneTasks > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                          <span className="text-[#34D399] font-medium">{doneTasks} done</span>
                        </div>
                      )}
                      {inReviewTasks > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#00BFA5]" />
                          <span className="text-[#00BFA5] font-medium">{inReviewTasks} review</span>
                        </div>
                      )}
                      {inProgressTasks > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#FBB13C]" />
                          <span className="text-[#FBB13C] font-medium">{inProgressTasks} progress</span>
                        </div>
                      )}
                    </div>
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
