'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { toast } from 'sonner'

const profileSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .max(120, 'Full name must be less than 120 characters'),
})

type ProfileInput = z.infer<typeof profileSchema>

interface ProfileSettingsProps {
  profile: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
    },
  })

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <AvatarWithFallback
          src={profile?.avatar_url}
          alt={profile?.full_name || 'User'}
          fallback={profile?.full_name?.[0] || 'U'}
          className="h-20 w-20"
        />
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Profile Picture
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Avatar upload coming soon
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            placeholder="John Doe"
            {...register('full_name')}
            disabled={isLoading}
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
