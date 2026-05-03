'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { CreateTaskDialog } from './CreateTaskDialog'
import { toast } from 'sonner'

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

interface KanbanBoardProps {
  projectId: string
  tasks: Task[]
  members: Array<{
    user_id: string
    role: string
    profiles: {
      id: string
      full_name: string
      email: string
      avatar_url: string | null
    }
  }>
  userRole: 'admin' | 'member'
  currentUserId: string
}

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' },
] as const

export function KanbanBoard({ projectId, tasks, members, userRole, currentUserId }: KanbanBoardProps) {
  const router = useRouter()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as 'todo' | 'in_progress' | 'in_review' | 'done'
    const task = tasks.find(t => t.id === taskId)

    if (!task || task.status === newStatus) return

    // Check permissions
    if (userRole === 'member' && task.assignee?.id !== currentUserId) {
      toast.error('You can only update tasks assigned to you')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to update task')
        return
      }

      toast.success('Task updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="space-y-4">
      {userRole === 'admin' && (
        <div className="flex justify-end">
          <CreateTaskDialog projectId={projectId} members={members} />
        </div>
      )}

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              isAdmin={userRole === 'admin'}
              projectId={projectId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 opacity-80">
              <TaskCard task={activeTask} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-950 rounded-lg p-4 shadow-lg">
            <p className="text-sm">Updating task...</p>
          </div>
        </div>
      )}
    </div>
  )
}
