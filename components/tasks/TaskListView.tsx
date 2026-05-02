'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, isPast, isToday } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { AlertCircle, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TaskDetailSheet } from './TaskDetailSheet'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'in_review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  assignee: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
}

interface Member {
  user_id: string
  profiles: {
    full_name: string
    email: string
    avatar_url: string | null
  }
}

interface TaskListViewProps {
  tasks: Task[]
  projectId: string
  userRole: 'admin' | 'member'
  currentUserId: string
  members: Member[]
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
  in_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}

type SortField = 'title' | 'status' | 'priority' | 'due_date'
type SortDirection = 'asc' | 'desc'

export function TaskListView({ tasks, projectId, userRole, currentUserId, members }: TaskListViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [sortField, setSortField] = useState<SortField>('due_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const statusFilter = searchParams.get('status') || 'all'
  const priorityFilter = searchParams.get('priority') || 'all'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter tasks
  let filteredTasks = tasks
  if (statusFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter)
  }
  if (priorityFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter)
  }

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'due_date') {
      aValue = aValue ? new Date(aValue).getTime() : Infinity
      bValue = bValue ? new Date(bValue).getTime() : Infinity
    } else if (sortField === 'priority') {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
      aValue = priorityOrder[a.priority]
      bValue = priorityOrder[b.priority]
    } else if (sortField === 'status') {
      const statusOrder = { todo: 0, in_progress: 1, in_review: 2, done: 3 }
      aValue = statusOrder[a.status]
      bValue = statusOrder[b.status]
    } else {
      aValue = aValue?.toString().toLowerCase() || ''
      bValue = bValue?.toString().toLowerCase() || ''
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value || 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={priorityFilter} onValueChange={(value) => handleFilterChange('priority', value || 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-2">
                    Priority
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('due_date')}>
                  <div className="flex items-center gap-2">
                    Due Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                sortedTasks.map((task) => {
                  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date))
                  const isDueToday = task.due_date && isToday(new Date(task.due_date))

                  return (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                      onClick={() => setSelectedTask(task)}
                    >
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[task.status]}>
                          {statusLabels[task.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <AvatarWithFallback
                              src={task.assignee.avatar_url}
                              alt={task.assignee.full_name}
                              fallback={task.assignee.full_name[0]}
                              className="h-6 w-6"
                            />
                            <span className="text-sm">{task.assignee.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.due_date ? (
                          <div
                            className={cn(
                              'flex items-center gap-1',
                              isOverdue && 'text-red-600 dark:text-red-400 font-semibold',
                              isDueToday && 'text-amber-600 dark:text-amber-400 font-semibold'
                            )}
                          >
                            {isOverdue && <AlertCircle className="h-4 w-4" />}
                            {format(new Date(task.due_date), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span className="text-slate-400">No due date</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailSheet
          task={selectedTask}
          projectId={projectId}
          userRole={userRole}
          currentUserId={currentUserId}
          members={members}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </>
  )
}
