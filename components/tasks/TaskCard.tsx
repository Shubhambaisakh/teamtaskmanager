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
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
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
          'cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow',
          (isDragging || isSortableDragging) && 'opacity-50'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-1 cursor-grab">
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-900 dark:text-white line-clamp-2 mb-2">
                {task.title}
              </h4>
              
              {task.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>

                {task.assignee && (
                  <AvatarWithFallback
                    src={task.assignee.avatar_url}
                    alt={task.assignee.full_name}
                    fallback={task.assignee.full_name[0]}
                    className="h-6 w-6"
                  />
                )}
              </div>

              {task.due_date && (
                <div
                  className={cn(
                    'flex items-center gap-1 mt-2 text-xs',
                    isOverdue && 'text-red-600 dark:text-red-400 font-semibold',
                    isDueToday && 'text-amber-600 dark:text-amber-400 font-semibold',
                    !isOverdue && !isDueToday && 'text-slate-500 dark:text-slate-400'
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
