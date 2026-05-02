import { z } from 'zod'

const taskStatusEnum = z.enum(['todo', 'in_progress', 'in_review', 'done'])
const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical'])

export const createTaskSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string()
    .min(1, 'Task title is required')
    .max(255, 'Task title must be less than 255 characters'),
  description: z.string().optional().nullable(),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  assignee_id: z.string().uuid('Invalid assignee ID').optional().nullable(),
  due_date: z.string().date('Invalid date format').optional().nullable(),
})

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(255, 'Task title must be less than 255 characters')
    .optional(),
  description: z.string().optional().nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assignee_id: z.string().uuid('Invalid assignee ID').optional().nullable(),
  due_date: z.string().date('Invalid date format').optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

export const updateStatusSchema = z.object({
  status: taskStatusEnum,
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type TaskStatus = z.infer<typeof taskStatusEnum>
export type TaskPriority = z.infer<typeof taskPriorityEnum>
