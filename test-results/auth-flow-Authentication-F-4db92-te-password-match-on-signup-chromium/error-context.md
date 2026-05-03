# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Authentication Flow >> should validate password match on signup
- Location: __tests__\e2e\auth-flow.spec.ts:113:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/passwords do not match/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/passwords do not match/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Create an account
      - generic [ref=e7]: Enter your information to create your account
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: Full Name
          - textbox "Full Name" [ref=e12]:
            - /placeholder: John Doe
            - text: John Doe
        - generic [ref=e13]:
          - generic [ref=e14]: Email
          - textbox "Email" [ref=e15]:
            - /placeholder: john@example.com
            - text: john@example.com
        - generic [ref=e16]:
          - generic [ref=e17]: Password
          - textbox "Password" [ref=e18]:
            - /placeholder: ••••••••
            - text: password123
        - generic [ref=e19]:
          - generic [ref=e20]: Confirm Password
          - textbox "Confirm Password" [active] [ref=e21]:
            - /placeholder: ••••••••
            - text: different123
          - paragraph [ref=e22]: Passwords don't match
      - generic [ref=e23]:
        - button "Sign Up" [ref=e24]
        - paragraph [ref=e25]:
          - text: Already have an account?
          - link "Sign in" [ref=e26] [cursor=pointer]:
            - /url: /login
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```

# Test source

```ts
  24  |     await page.goto('/login')
  25  |     
  26  |     // Check for form elements
  27  |     await expect(page.getByLabel(/email/i)).toBeVisible()
  28  |     await expect(page.getByLabel(/password/i)).toBeVisible()
  29  |     await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
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
> 124 |     await expect(page.getByText(/passwords do not match/i)).toBeVisible()
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  125 |   })
  126 | })
  127 | 
  128 | test.describe('Authenticated User Flow', () => {
  129 |   // Note: These tests would require actual authentication setup
  130 |   // For now, they serve as documentation of expected behavior
  131 |   
  132 |   test.skip('should redirect authenticated user from login to dashboard', async ({ page }) => {
  133 |     // This test would require setting up authentication state
  134 |     await page.goto('/login')
  135 |     await expect(page).toHaveURL(/\/dashboard/)
  136 |   })
  137 | 
  138 |   test.skip('should allow authenticated user to access dashboard', async ({ page }) => {
  139 |     // This test would require setting up authentication state
  140 |     await page.goto('/dashboard')
  141 |     await expect(page.getByText(/dashboard/i)).toBeVisible()
  142 |   })
  143 | 
  144 |   test.skip('should allow user to sign out', async ({ page }) => {
  145 |     // This test would require setting up authentication state
  146 |     await page.goto('/dashboard')
  147 |     
  148 |     // Click user menu
  149 |     await page.getByRole('button', { name: /user menu/i }).click()
  150 |     
  151 |     // Click sign out
  152 |     await page.getByText(/sign out/i).click()
  153 |     
  154 |     // Should redirect to login
  155 |     await expect(page).toHaveURL(/\/login/)
  156 |   })
  157 | })
  158 | 
```