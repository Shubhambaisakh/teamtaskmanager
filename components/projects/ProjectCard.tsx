import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProjectProgressBar } from '@/components/projects/ProjectProgressBar'
import { Users } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    role: 'admin' | 'member'
    task_count: number
    done_count: number
    archived_at?: string | null
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.task_count > 0 
    ? Math.round((project.done_count / project.task_count) * 100) 
    : 0

  return (
    <Link href={`/projects/${project.id}/board`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              {project.description && (
                <CardDescription className="mt-2 line-clamp-2">
                  {project.description}
                </CardDescription>
              )}
            </div>
            {project.archived_at && (
              <Badge variant="secondary" className="ml-2">
                Archived
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {project.task_count} {project.task_count === 1 ? 'task' : 'tasks'}
            </span>
            <Badge variant={project.role === 'admin' ? 'default' : 'secondary'}>
              {project.role}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProjectProgressBar progress={progress} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
