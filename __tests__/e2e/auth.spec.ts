import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Authentication Flow
 * Validates: Requirements 1.1–1.9
 */

test.describe('Authentication', () => {
  test('should redirect unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect unauthenticated user from /projects to /login', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display login page with all required elements', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
    await expect(page.getByText(/forgot password/i)).toBeVisible()
    await expect(page.getByText(/sign up/i)).toBeVisible()
  })

  test('should display signup page with all required elements', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should show validation errors on empty login submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })

  test('should show validation errors on empty signup submit', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('button', { name: /sign up/i }).click()
    await expect(page.getByText(/full name is required/i)).toBeVisible()
  })

  test('should show error for invalid email format on login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('not-an-email')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should show error for short password on signup', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('short')
    await page.getByLabel(/confirm password/i).fill('short')
    await page.getByRole('button', { name: /sign up/i }).click()
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
  })

  test('should show error for password mismatch on signup', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('different123')
    await page.getByRole('button', { name: /sign up/i }).click()
    await expect(page.getByText(/passwords/i)).toBeVisible()
  })

  test('should navigate from login to signup', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/sign up/i).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should navigate from signup to login', async ({ page }) => {
    await page.goto('/signup')
    await page.getByText(/sign in/i).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/forgot password/i).click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })

  test('should display forgot password form', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  })

  test('should show health check endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('ok')
    expect(body.timestamp).toBeTruthy()
  })
})
