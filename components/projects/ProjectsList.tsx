'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { EmptyState } from '@/components/shared/EmptyState'

interface Project {
  id: string
  name: string
  description: string | null
  role: 'admin' | 'member'
  archived_at: string | null
  created_at: string
  task_count: number
  done_count: number
}

interface ProjectsListProps {
  projects: Project[]
  globalRole: 'admin' | 'member'
}

export function ProjectsList({ projects, globalRole }: ProjectsListProps) {
  const router = useRouter()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your team projects and track progress
          </p>
        </div>
        {globalRole === 'admin' && (
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={{
            label: 'Create Project',
            onClick: () => router.push('/projects/new'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
