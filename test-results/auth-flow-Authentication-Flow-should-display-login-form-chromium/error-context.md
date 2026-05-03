# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Authentication Flow >> should display login form
- Location: __tests__\e2e\auth-flow.spec.ts:23:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /sign in/i })
Expected: visible
Error: strict mode violation: getByRole('button', { name: /sign in/i }) resolved to 2 elements:
    1) <button tabindex="0" type="submit" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 da…>Sign In</button> aka getByRole('button', { name: 'Sign In', exact: true })
    2) <button tabindex="0" type="button" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:bor…>Sign in with Google</button> aka getByRole('button', { name: 'Sign in with Google' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /sign in/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Welcome back
      - generic [ref=e7]: Sign in to your account to continue
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: Email
          - textbox "Email" [ref=e12]:
            - /placeholder: john@example.com
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]: Password
            - link "Forgot password?" [ref=e16] [cursor=pointer]:
              - /url: /forgot-password
          - textbox "Password" [ref=e17]:
            - /placeholder: ••••••••
      - generic [ref=e18]:
        - button "Sign In" [ref=e19]
        - generic [ref=e20]:
          - separator [ref=e21]
          - generic [ref=e22]: OR
        - button "Sign in with Google" [ref=e23]
        - paragraph [ref=e24]:
          - text: Don't have an account?
          - link "Sign up" [ref=e25] [cursor=pointer]:
            - /url: /signup
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e31] [cursor=pointer]:
    - img [ref=e32]
  - alert [ref=e35]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | /**
  4   |  * E2E Tests for Authentication Flow
  5   |  * 
  6   |  * These tests validate the complete user authentication journey
  7   |  */
  8   | 
  9   | test.describe('Authentication Flow', () => {
  10  |   test.beforeEach(async ({ page }) => {
  11  |     // Start from the home page
  12  |     await page.goto('/')
  13  |   })
  14  | 
  15  |   test('should redirect unauthenticated user to login', async ({ page }) => {
  16  |     // Try to access dashboard
  17  |     await page.goto('/dashboard')
  18  |     
  19  |     // Should redirect to login
  20  |     await expect(page).toHaveURL(/\/login/)
  21  |   })
  22  | 
  23  |   test('should display login form', async ({ page }) => {
  24  |     await page.goto('/login')
  25  |     
  26  |     // Check for form elements
  27  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  28  |     await expect(page.getByLabel(/password/i)).toBeVisible()
> 29  |     await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
      |                                                                  ^ Error: expect(locator).toBeVisible() failed
  30  |     await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  31  |   })
  32  | 
  33  |   test('should display signup form', async ({ page }) => {
  34  |     await page.goto('/signup')
  35  |     
  36  |     // Check for form elements
  37  |     await expect(page.getByLabel(/full name/i)).toBeVisible()
  38  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  39  |     await expect(page.getByLabel(/^password$/i)).toBeVisible()
  40  |     await expect(page.getByLabel(/confirm password/i)).toBeVisible()
  41  |     await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  42  |   })
  43  | 
  44  |   test('should show validation errors on empty login', async ({ page }) => {
  45  |     await page.goto('/login')
  46  |     
  47  |     // Click submit without filling form
  48  |     await page.getByRole('button', { name: /^sign in$/i }).click()
  49  |     
  50  |     // Should show validation errors
  51  |     await expect(page.getByText(/email is required/i)).toBeVisible()
  52  |   })
  53  | 
  54  |   test('should show validation errors on empty signup', async ({ page }) => {
  55  |     await page.goto('/signup')
  56  |     
  57  |     // Click submit without filling form
  58  |     await page.getByRole('button', { name: /sign up/i }).click()
  59  |     
  60  |     // Should show validation errors
  61  |     await expect(page.getByText(/full name is required/i)).toBeVisible()
  62  |   })
  63  | 
  64  |   test('should navigate between auth pages', async ({ page }) => {
  65  |     await page.goto('/login')
  66  |     
  67  |     // Click "Don't have an account?" link
  68  |     await page.getByText(/don't have an account/i).click()
  69  |     await expect(page).toHaveURL(/\/signup/)
  70  |     
  71  |     // Click "Already have an account?" link
  72  |     await page.getByText(/already have an account/i).click()
  73  |     await expect(page).toHaveURL(/\/login/)
  74  |     
  75  |     // Click "Forgot password?" link
  76  |     await page.getByText(/forgot password/i).click()
  77  |     await expect(page).toHaveURL(/\/forgot-password/)
  78  |   })
  79  | 
  80  |   test('should display forgot password form', async ({ page }) => {
  81  |     await page.goto('/forgot-password')
  82  |     
  83  |     // Check for form elements
  84  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  85  |     await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
  86  |   })
  87  | 
  88  |   test('should validate email format on login', async ({ page }) => {
  89  |     await page.goto('/login')
  90  |     
  91  |     // Enter invalid email
  92  |     await page.getByLabel(/email/i).fill('invalid-email')
  93  |     await page.getByRole('button', { name: /^sign in$/i }).click()
  94  |     
  95  |     // Should show validation error
  96  |     await expect(page.getByText(/invalid email/i)).toBeVisible()
  97  |   })
  98  | 
  99  |   test('should validate password length on signup', async ({ page }) => {
  100 |     await page.goto('/signup')
  101 |     
  102 |     // Fill form with short password
  103 |     await page.getByLabel(/full name/i).fill('John Doe')
  104 |     await page.getByLabel(/email/i).fill('john@example.com')
  105 |     await page.getByLabel(/^password$/i).fill('short')
  106 |     await page.getByLabel(/confirm password/i).fill('short')
  107 |     await page.getByRole('button', { name: /sign up/i }).click()
  108 |     
  109 |     // Should show validation error
  110 |     await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  111 |   })
  112 | 
  113 |   test('should validate password match on signup', async ({ page }) => {
  114 |     await page.goto('/signup')
  115 |     
  116 |     // Fill form with mismatched passwords
  117 |     await page.getByLabel(/full name/i).fill('John Doe')
  118 |     await page.getByLabel(/email/i).fill('john@example.com')
  119 |     await page.getByLabel(/^password$/i).fill('password123')
  120 |     await page.getByLabel(/confirm password/i).fill('different123')
  121 |     await page.getByRole('button', { name: /sign up/i }).click()
  122 |     
  123 |     // Should show validation error
  124 |     await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  125 |   })
  126 | })
  127 | 
  128 | test.describe('Authenticated User Flow', () => {
  129 |   // Note: These tests would require actual authentication setup
```