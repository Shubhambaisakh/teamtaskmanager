import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock Supabase client
const mockSignInWithPassword = vi.fn()
const mockSignInWithOAuth = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('should show validation error for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('should call signInWithPassword with correct credentials', async () => {
    const user = userEvent.setup()
    mockSignInWithPassword.mockResolvedValue({ 
      data: { user: { id: '123' }, session: {} }, 
      error: null 
    })
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      })
    })
  })

  it('should redirect to dashboard on successful login', async () => {
    const user = userEvent.setup()
    mockSignInWithPassword.mockResolvedValue({ 
      data: { user: { id: '123' }, session: {} }, 
      error: null 
    })
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should show error message on login failure', async () => {
    const user = userEvent.setup()
    const { toast } = await import('sonner')
    mockSignInWithPassword.mockResolvedValue({ 
      data: null, 
      error: { message: 'Invalid credentials' } 
    })
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should call signInWithOAuth when Google button is clicked', async () => {
    const user = userEvent.setup()
    mockSignInWithOAuth.mockResolvedValue({ data: {}, error: null })
    
    render(<LoginPage />)
    
    const googleButton = screen.getByRole('button', { name: /sign in with google/i })
    await user.click(googleButton)
    
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
      })
    })
  })

  it('should have link to signup page', () => {
    render(<LoginPage />)
    
    const signupLink = screen.getByText(/don't have an account/i).closest('a')
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should have link to forgot password page', () => {
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.getByText(/forgot password/i)
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })
})
