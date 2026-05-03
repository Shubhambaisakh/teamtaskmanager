# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should display forgot password form
- Location: __tests__\e2e\auth.spec.ts:95:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator:  getByLabel(/email/i)
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel(/email/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Reset password
      - generic [ref=e7]: Enter your email address and we'll send you a reset link
    - generic [ref=e8]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email
        - textbox "Email" [ref=e12]:
          - /placeholder: john@example.com
      - generic [ref=e13]:
        - button "Send Reset Link" [ref=e14]
        - paragraph [ref=e15]:
          - text: Remember your password?
          - link "Sign in" [ref=e16] [cursor=pointer]:
            - /url: /login
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | /**
  4   |  * E2E Tests for Authentication Flow
  5   |  * Validates: Requirements 1.1–1.9
  6   |  */
  7   | 
  8   | test.describe('Authentication', () => {
  9   |   test('should redirect unauthenticated user from /dashboard to /login', async ({ page }) => {
  10  |     await page.goto('/dashboard')
  11  |     await expect(page).toHaveURL(/\/login/)
  12  |   })
  13  | 
  14  |   test('should redirect unauthenticated user from /projects to /login', async ({ page }) => {
  15  |     await page.goto('/projects')
  16  |     await expect(page).toHaveURL(/\/login/)
  17  |   })
  18  | 
  19  |   test('should display login page with all required elements', async ({ page }) => {
  20  |     await page.goto('/login')
  21  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  22  |     await expect(page.getByLabel(/password/i)).toBeVisible()
  23  |     await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  24  |     await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  25  |     await expect(page.getByText(/forgot password/i)).toBeVisible()
  26  |     await expect(page.getByText(/sign up/i)).toBeVisible()
  27  |   })
  28  | 
  29  |   test('should display signup page with all required elements', async ({ page }) => {
  30  |     await page.goto('/signup')
  31  |     await expect(page.getByLabel(/full name/i)).toBeVisible()
  32  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  33  |     await expect(page.getByLabel(/^password$/i)).toBeVisible()
  34  |     await expect(page.getByLabel(/confirm password/i)).toBeVisible()
  35  |     await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  36  |   })
  37  | 
  38  |   test('should show validation errors on empty login submit', async ({ page }) => {
  39  |     await page.goto('/login')
  40  |     await page.getByRole('button', { name: /^sign in$/i }).click()
  41  |     await expect(page.getByText(/email is required/i)).toBeVisible()
  42  |   })
  43  | 
  44  |   test('should show validation errors on empty signup submit', async ({ page }) => {
  45  |     await page.goto('/signup')
  46  |     await page.getByRole('button', { name: /sign up/i }).click()
  47  |     await expect(page.getByText(/full name is required/i)).toBeVisible()
  48  |   })
  49  | 
  50  |   test('should show error for invalid email format on login', async ({ page }) => {
  51  |     await page.goto('/login')
  52  |     await page.getByLabel(/email/i).fill('not-an-email')
  53  |     await page.getByRole('button', { name: /^sign in$/i }).click()
  54  |     await expect(page.getByText(/invalid email/i)).toBeVisible()
  55  |   })
  56  | 
  57  |   test('should show error for short password on signup', async ({ page }) => {
  58  |     await page.goto('/signup')
  59  |     await page.getByLabel(/full name/i).fill('Test User')
  60  |     await page.getByLabel(/email/i).fill('test@example.com')
  61  |     await page.getByLabel(/^password$/i).fill('short')
  62  |     await page.getByLabel(/confirm password/i).fill('short')
  63  |     await page.getByRole('button', { name: /sign up/i }).click()
  64  |     await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
  65  |   })
  66  | 
  67  |   test('should show error for password mismatch on signup', async ({ page }) => {
  68  |     await page.goto('/signup')
  69  |     await page.getByLabel(/full name/i).fill('Test User')
  70  |     await page.getByLabel(/email/i).fill('test@example.com')
  71  |     await page.getByLabel(/^password$/i).fill('password123')
  72  |     await page.getByLabel(/confirm password/i).fill('different123')
  73  |     await page.getByRole('button', { name: /sign up/i }).click()
  74  |     await expect(page.getByText(/passwords/i)).toBeVisible()
  75  |   })
  76  | 
  77  |   test('should navigate from login to signup', async ({ page }) => {
  78  |     await page.goto('/login')
  79  |     await page.getByText(/sign up/i).click()
  80  |     await expect(page).toHaveURL(/\/signup/)
  81  |   })
  82  | 
  83  |   test('should navigate from signup to login', async ({ page }) => {
  84  |     await page.goto('/signup')
  85  |     await page.getByText(/sign in/i).click()
  86  |     await expect(page).toHaveURL(/\/login/)
  87  |   })
  88  | 
  89  |   test('should navigate to forgot password page', async ({ page }) => {
  90  |     await page.goto('/login')
  91  |     await page.getByText(/forgot password/i).click()
  92  |     await expect(page).toHaveURL(/\/forgot-password/)
  93  |   })
  94  | 
  95  |   test('should display forgot password form', async ({ page }) => {
  96  |     await page.goto('/forgot-password')
> 97  |     await expect(page.getByLabel(/email/i)).toBeVisible()
      |                                             ^ Error: expect(locator).toBeVisible() failed
  98  |     await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  99  |   })
  100 | 
  101 |   test('should show health check endpoint', async ({ page }) => {
  102 |     const response = await page.request.get('/api/health')
  103 |     expect(response.status()).toBe(200)
  104 |     const body = await response.json()
  105 |     expect(body.status).toBe('ok')
  106 |     expect(body.timestamp).toBeTruthy()
  107 |   })
  108 | })
  109 | 
```