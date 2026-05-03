'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth.schema'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('An account with this email already exists')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Account created! Please check your email to verify your account.')
      router.push('/login')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
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
          maxWidth: '440px',
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
              }}>Create an account</h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(232,232,240,0.45)',
                lineHeight: '1.5'
              }}>Enter your information to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="full_name" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#E8E8F0',
                  marginBottom: '8px'
                }}>Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  {...register('full_name')}
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
                {errors.full_name && (
                  <p style={{ fontSize: '12px', color: '#F87171', marginTop: '6px' }}>
                    {errors.full_name.message}
                  </p>
                )}
              </div>

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
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#E8E8F0',
                  marginBottom: '8px'
                }}>Password</label>
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

              <div>
                <label htmlFor="confirm_password" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#E8E8F0',
                  marginBottom: '8px'
                }}>Confirm Password</label>
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirm_password')}
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
                {errors.confirm_password && (
                  <p style={{ fontSize: '12px', color: '#F87171', marginTop: '6px' }}>
                    {errors.confirm_password.message}
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
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>

              <p style={{
                fontSize: '13px',
                textAlign: 'center',
                color: 'rgba(232,232,240,0.45)',
                marginTop: '8px'
              }}>
                Already have an account?{' '}
                <Link href="/login" style={{
                  color: '#26D0B8',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
