'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

export function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const onSubmit = async (data: PasswordChangeInput) => {
    setIsLoading(true)
    try {
      // First, verify the current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        toast.error('User not found')
        return
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      })

      if (signInError) {
        toast.error('Current password is incorrect')
        return
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (updateError) {
        toast.error('Failed to update password')
        return
      }

      toast.success('Password updated successfully!')
      reset()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Enter current password"
          {...register('currentPassword')}
          disabled={isLoading}
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter new password (min 8 characters)"
          {...register('newPassword')}
          disabled={isLoading}
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
