'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { CommentList } from './CommentList'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateTaskSchema, type UpdateTaskInput } from '@/lib/validations/task.schema'

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

interface TaskDetailSheetProps {
  task: Task
  projectId: string
  userRole: 'admin' | 'member'
  currentUserId: string
  members: Member[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}

export function TaskDetailSheet({
  task,
  projectId,
  userRole,
  currentUserId,
  members,
  open,
  onOpenChange,
}: TaskDetailSheetProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEdit = userRole === 'admin' || (task.assignee?.id === currentUserId)
  const canDelete = userRole === 'admin'
  const canEditAllFields = userRole === 'admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee_id: task.assignee?.id || null,
      due_date: task.due_date || null,
    },
  })

  const onSubmit = async (data: UpdateTaskInput) => {
    try {
      // If member, only allow status updates
      const payload = canEditAllFields ? data : { status: data.status }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to update task')
        return
      }

      toast.success('Task updated successfully')
      setIsEditing(false)
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete task')
        return
      }

      toast.success('Task deleted successfully')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Edit task details' : 'View task information'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            {isEditing && canEditAllFields ? (
              <>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Task title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing && canEditAllFields ? (
              <>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Task description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                {task.description || 'No description'}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className="w-fit">{statusLabels[task.status]}</Badge>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            {isEditing && canEditAllFields ? (
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className="w-fit capitalize">{task.priority}</Badge>
            )}
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            {isEditing && canEditAllFields ? (
              <Select
                value={watch('assignee_id') || 'unassigned'}
                onValueChange={(value) =>
                  setValue('assignee_id', value === 'unassigned' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {member.profiles.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : task.assignee ? (
              <div className="flex items-center gap-2">
                <AvatarWithFallback
                  src={task.assignee.avatar_url}
                  alt={task.assignee.full_name}
                  fallback={task.assignee.full_name[0]}
                  className="h-8 w-8"
                />
                <div>
                  <p className="font-medium">{task.assignee.full_name}</p>
                  <p className="text-sm text-slate-500">{task.assignee.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Unassigned</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            {isEditing && canEditAllFields ? (
              <>
                <Input
                  id="due_date"
                  type="date"
                  {...register('due_date')}
                />
                {errors.due_date && (
                  <p className="text-sm text-red-600">{errors.due_date.message}</p>
                )}
              </>
            ) : task.due_date ? (
              <p>{format(new Date(task.due_date), 'MMMM d, yyyy')}</p>
            ) : (
              <p className="text-slate-400">No due date</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Task
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </>
              ) : canEdit ? (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Task
                </Button>
              ) : null}
            </div>
          </div>
        </form>

        {/* Comments Section */}
        <div className="mt-8 pt-6 border-t">
          <CommentList
            taskId={task.id}
            currentUserId={currentUserId}
            isAdmin={userRole === 'admin'}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
