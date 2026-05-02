'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { CheckSquare } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  assignee: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
}

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  isAdmin: boolean
  projectId: string
}

export function KanbanColumn({ id, title, tasks, isAdmin, projectId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-slate-50 dark:bg-slate-900 rounded-lg p-4 min-h-[500px] transition-colors ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 flex-1">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={CheckSquare}
                title="No tasks"
                description={`No tasks in ${title.toLowerCase()}`}
              />
            </div>
          ) : (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}
