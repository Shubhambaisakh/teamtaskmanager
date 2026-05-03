'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, isPast, isToday } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'in_review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  projects: {
    id: string
    name: string
  }
}

interface MyTasksListProps {
  tasks: Task[]
}

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const statusColors = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  in_review: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

export function MyTasksList({ tasks }: MyTasksListProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'in_review' | 'done'>('all')

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter)

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate))
  }

  const isDueToday = (dueDate: string | null) => {
    if (!dueDate) return false
    return isToday(new Date(dueDate))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'todo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('todo')}
            >
              To Do
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={filter === 'in_review' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_review')}
            >
              In Review
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="You're all caught up!"
            description="No tasks assigned to you."
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projects.id}/board`}
                className="block"
              >
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {task.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {task.projects.name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <Badge className={statusColors[task.status]}>
                          {statusLabels[task.status]}
                        </Badge>
                      </div>
                      {task.due_date && (
                        <span
                          className={cn(
                            'text-xs',
                            isOverdue(task.due_date) && 'text-red-600 dark:text-red-400 font-semibold',
                            isDueToday(task.due_date) && 'text-amber-600 dark:text-amber-400 font-semibold',
                            !isOverdue(task.due_date) && !isDueToday(task.due_date) && 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {isOverdue(task.due_date) && '🔴 '}
                          {isDueToday(task.due_date) && '🟡 '}
                          Due {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
