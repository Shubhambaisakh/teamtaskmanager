'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginSchema, type LoginInput } from '@/lib/validations/auth.schema'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error('Invalid email or password')
        return
      }

      toast.success('Signed in successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : '/auth/callback'
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        toast.error('Failed to sign in with Google')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          background: #0A0A0F !important;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#0A0A0F',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow effect */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(0,191,165,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '32px',
            textDecoration: 'none',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00BFA5, #00A896)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,191,165,0.4)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#E8E8F0',
              letterSpacing: '-0.3px'
            }}>TaskFlow</span>
          </Link>

          {/* Card */}
          <div style={{
            background: '#111118',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '500',
                color: '#F0F0FA',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>Welcome back</h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(232,232,240,0.45)',
                lineHeight: '1.5'
              }}>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#E8E8F0',
                  marginBottom: '8px'
                }}>Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#E8E8F0',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(0,191,165,0.4)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
                {errors.email && (
                  <p style={{ fontSize: '12px', color: '#F87171', marginTop: '6px' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor="password" style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#E8E8F0'
                  }}>Password</label>
                  <Link href="/forgot-password" style={{
                    fontSize: '12px',
                    color: '#26D0B8',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#E8E8F0',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(0,191,165,0.4)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
                {errors.password && (
                  <p style={{ fontSize: '12px', color: '#F87171', marginTop: '6px' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: isLoading ? 'rgba(0,191,165,0.5)' : 'linear-gradient(135deg, #00BFA5, #00A896)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(0,191,165,0.35)',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div style={{ position: 'relative', margin: '8px 0' }}>
                <div style={{
                  height: '0.5px',
                  background: 'rgba(255,255,255,0.12)'
                }}></div>
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#111118',
                  padding: '0 12px',
                  fontSize: '12px',
                  color: 'rgba(232,232,240,0.35)'
                }}>OR</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#E8E8F0',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => !isGoogleLoading && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
              </button>

              <p style={{
                fontSize: '13px',
                textAlign: 'center',
                color: 'rgba(232,232,240,0.45)',
                marginTop: '8px'
              }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{
                  color: '#26D0B8',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
