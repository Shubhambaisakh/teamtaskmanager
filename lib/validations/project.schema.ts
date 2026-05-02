import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(120, 'Project name must be less than 120 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
})

export const updateProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(120, 'Project name must be less than 120 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
  archived_at: z.string().datetime().optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
