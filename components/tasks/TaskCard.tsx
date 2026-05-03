'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isPast, isToday } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { GripVertical, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  assignee: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
}

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const priorityColors = {
  low: 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30',
  medium: 'bg-[#FBB13C]/15 text-[#FBB13C] border border-[#FBB13C]/30',
  high: 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30',
  critical: 'bg-[#00E5CC]/15 text-[#00E5CC] border border-[#00E5CC]/30',
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date))
  const isDueToday = task.due_date && isToday(new Date(task.due_date))

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          'cursor-grab active:cursor-grabbing transition-all duration-200 bg-[#16161F] border-white/[0.07] hover:border-[#00BFA5]/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00BFA5]/10',
          (isDragging || isSortableDragging) && 'opacity-50 rotate-2'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-1 cursor-grab hover:text-[#00BFA5] transition-colors">
              <GripVertical className="h-4 w-4 text-white/30" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#E8E8F0] line-clamp-2 mb-2 text-sm">
                {task.title}
              </h4>
              
              {task.description && (
                <p className="text-xs text-white/40 line-clamp-2 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className={cn('px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide', priorityColors[task.priority])}>
                  {task.priority}
                </span>

                {task.assignee && (
                  <AvatarWithFallback
                    src={task.assignee.avatar_url}
                    alt={task.assignee.full_name}
                    fallback={task.assignee.full_name[0]}
                    className="h-6 w-6 border border-white/10"
                  />
                )}
              </div>

              {task.due_date && (
                <div
                  className={cn(
                    'flex items-center gap-1 mt-2 text-[10px] font-medium',
                    isOverdue && 'text-[#F87171]',
                    isDueToday && 'text-[#FBB13C]',
                    !isOverdue && !isDueToday && 'text-white/35'
                  )}
                >
                  {isOverdue ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                  <span>
                    {isOverdue && 'Overdue: '}
                    {isDueToday && 'Due today: '}
                    {format(new Date(task.due_date), 'MMM d')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
