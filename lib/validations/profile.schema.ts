import { z } from 'zod'

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(120, 'Full name must be less than 120 characters'),
  avatar_url: z.string().url('Invalid URL').nullable().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
