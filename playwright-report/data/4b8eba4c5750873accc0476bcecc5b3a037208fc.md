# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should navigate to forgot password page
- Location: __tests__\e2e\auth.spec.ts:89:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/forgot-password/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:3000/login"

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
            - link "Forgot password?" [active] [ref=e16] [cursor=pointer]:
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
    - generic [ref=e34]:
      - text: Rendering
      - generic [ref=e35]:
        - generic [ref=e36]: .
        - generic [ref=e37]: .
        - generic [ref=e38]: .
  - alert [ref=e39]
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
> 92  |     await expect(page).toHaveURL(/\/forgot-password/)
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  93  |   })
  94  | 
  95  |   test('should display forgot password form', async ({ page }) => {
  96  |     await page.goto('/forgot-password')
  97  |     await expect(page.getByLabel(/email/i)).toBeVisible()
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