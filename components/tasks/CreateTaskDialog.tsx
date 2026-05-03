'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
})

type CreateTaskInput = z.infer<typeof createTaskSchema>

interface Member {
  user_id: string
  role: string
  profiles: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }
}

interface CreateTaskDialogProps {
  projectId: string
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [isFetchingMembers, setIsFetchingMembers] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'medium',
    },
  })

  // Fetch project members when dialog opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectMembers()
    }
  }, [isOpen, projectId])

  const fetchProjectMembers = async () => {
    setIsFetchingMembers(true)
    try {
      console.log('Fetching members for project:', projectId)
      
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          user_id,
          role,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('project_id', projectId)

      console.log('Members data:', data)
      console.log('Members error:', error)

      if (error) {
        console.error('Error fetching members:', error)
        toast.error('Failed to load project members')
        return
      }

      // Transform the data to match Member type
      const transformedMembers = (data || []).map((member: any) => ({
        user_id: member.user_id,
        role: member.role,
        profiles: Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
      }))

      console.log('Setting members:', transformedMembers.length, 'members found')
      setMembers(transformedMembers)
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Failed to load project members')
    } finally {
      setIsFetchingMembers(false)
    }
  }

  const onSubmit = async (data: CreateTaskInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          project_id: projectId,
          status: 'todo',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to create task')
        return
      }

      toast.success('Task created successfully!')
      reset()
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 hover:transform hover:-translate-y-0.5 shadow-lg" style={{ background: 'linear-gradient(135deg, #00BFA5, #00A896)', boxShadow: '0 4px 16px rgba(0, 191, 165, 0.35)' }}>
        <Plus className="h-4 w-4" />
        New Task
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to this project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Task title"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description..."
              rows={3}
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) => setValue('priority', value as any)}
                disabled={isLoading}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                onValueChange={(value: string | null) => setValue('assignee_id', value === 'unassigned' || !value ? undefined : value)}
                disabled={isLoading || isFetchingMembers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    isFetchingMembers 
                      ? "Loading members..." 
                      : "Select assignee (optional)"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {isFetchingMembers ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="py-2 px-2 text-sm text-slate-500">
                      No members found
                    </div>
                  ) : (
                    members.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.profiles.full_name} ({member.role})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
