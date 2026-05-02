import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Authentication Flow
 * 
 * These tests validate the complete user authentication journey
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/')
  })

  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Try to access dashboard
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    
    // Check for form elements
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })

  test('should display signup form', async ({ page }) => {
    await page.goto('/signup')
    
    // Check for form elements
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login')
    
    // Click submit without filling form
    await page.getByRole('button', { name: /^sign in$/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })

  test('should show validation errors on empty signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Click submit without filling form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/full name is required/i)).toBeVisible()
  })

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/login')
    
    // Click "Don't have an account?" link
    await page.getByText(/don't have an account/i).click()
    await expect(page).toHaveURL(/\/signup/)
    
    // Click "Already have an account?" link
    await page.getByText(/already have an account/i).click()
    await expect(page).toHaveURL(/\/login/)
    
    // Click "Forgot password?" link
    await page.getByText(/forgot password/i).click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })

  test('should display forgot password form', async ({ page }) => {
    await page.goto('/forgot-password')
    
    // Check for form elements
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
  })

  test('should validate email format on login', async ({ page }) => {
    await page.goto('/login')
    
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should validate password length on signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill form with short password
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/^password$/i).fill('short')
    await page.getByLabel(/confirm password/i).fill('short')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  test('should validate password match on signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill form with mismatched passwords
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('different123')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })
})

test.describe('Authenticated User Flow', () => {
  // Note: These tests would require actual authentication setup
  // For now, they serve as documentation of expected behavior
  
  test.skip('should redirect authenticated user from login to dashboard', async ({ page }) => {
    // This test would require setting up authentication state
    await page.goto('/login')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test.skip('should allow authenticated user to access dashboard', async ({ page }) => {
    // This test would require setting up authentication state
    await page.goto('/dashboard')
    await expect(page.getByText(/dashboard/i)).toBeVisible()
  })

  test.skip('should allow user to sign out', async ({ page }) => {
    // This test would require setting up authentication state
    await page.goto('/dashboard')
    
    // Click user menu
    await page.getByRole('button', { name: /user menu/i }).click()
    
    // Click sign out
    await page.getByText(/sign out/i).click()
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
