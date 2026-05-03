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

  // Color coding for each column
  const columnStyles = {
    todo: {
      bg: 'bg-[#111118]',
      border: 'border-[#F87171]/20',
      hoverBorder: 'border-[#F87171]/40',
      badge: 'bg-[#F87171]/15 text-[#F87171]',
      header: 'text-[#F87171]'
    },
    in_progress: {
      bg: 'bg-[#111118]',
      border: 'border-[#FBB13C]/20',
      hoverBorder: 'border-[#FBB13C]/40',
      badge: 'bg-[#FBB13C]/15 text-[#FBB13C]',
      header: 'text-[#FBB13C]'
    },
    in_review: {
      bg: 'bg-[#111118]',
      border: 'border-[#00BFA5]/20',
      hoverBorder: 'border-[#00BFA5]/40',
      badge: 'bg-[#00BFA5]/15 text-[#26D0B8]',
      header: 'text-[#26D0B8]'
    },
    done: {
      bg: 'bg-[#111118]',
      border: 'border-[#34D399]/20',
      hoverBorder: 'border-[#34D399]/40',
      badge: 'bg-[#34D399]/15 text-[#34D399]',
      header: 'text-[#34D399]'
    }
  }

  const style = columnStyles[id as keyof typeof columnStyles] || columnStyles.todo

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col ${style.bg} border-2 ${isOver ? style.hoverBorder : style.border} rounded-xl p-4 min-h-[500px] transition-all duration-200 ${
        isOver ? 'shadow-lg scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${style.header}`}>{title}</h3>
        <span className={`${style.badge} px-2 py-1 rounded-full text-xs font-bold`}>{tasks.length}</span>
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
