'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth.schema'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/reset-password`
        : '/auth/reset-password'
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        toast.error('Failed to send reset email')
        return
      }

      setEmailSent(true)
      toast.success('If an account exists, a reset link has been sent')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        <CardDescription>
          {emailSent
            ? 'Check your email for a password reset link'
            : 'Enter your email address and we\'ll send you a reset link'}
        </CardDescription>
      </CardHeader>
      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      ) : (
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
