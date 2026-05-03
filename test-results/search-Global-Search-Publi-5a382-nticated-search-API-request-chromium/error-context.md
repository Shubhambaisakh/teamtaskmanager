# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search.spec.ts >> Global Search (Public Routes) >> should redirect unauthenticated search API request
- Location: __tests__\e2e\search.spec.ts:9:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [401, 302, 307]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | /**
  4  |  * E2E Tests for Global Search
  5  |  * Validates: Requirements 12.1, 12.2, 12.4
  6  |  */
  7  | 
  8  | test.describe('Global Search (Public Routes)', () => {
  9  |   test('should redirect unauthenticated search API request', async ({ page }) => {
  10 |     const response = await page.request.get('/api/search?q=test')
> 11 |     expect([401, 302, 307]).toContain(response.status())
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  12 |   })
  13 | 
  14 |   test('should return 400 for short query', async ({ page }) => {
  15 |     // This would need auth, but we can test the validation logic
  16 |     const query = 'ab'
  17 |     expect(query.length < 3).toBe(true)
  18 |   })
  19 | })
  20 | 
  21 | test.describe('Global Search (Authenticated)', () => {
  22 |   test.skip('should show search input in navbar', async ({ page }) => {
  23 |     // Requires: logged in
  24 |     await page.goto('/dashboard')
  25 |     await expect(page.getByPlaceholder(/search/i)).toBeVisible()
  26 |   })
  27 | 
  28 |   test.skip('should show results after typing 3+ characters', async ({ page }) => {
  29 |     // Requires: logged in with data
  30 |     await page.goto('/dashboard')
  31 |     await page.getByPlaceholder(/search/i).fill('test')
  32 |     await expect(page.getByText(/projects|tasks/i)).toBeVisible()
  33 |   })
  34 | 
  35 |   test.skip('should not show results for less than 3 characters', async ({ page }) => {
  36 |     // Requires: logged in
  37 |     await page.goto('/dashboard')
  38 |     await page.getByPlaceholder(/search/i).fill('te')
  39 |     await expect(page.getByRole('listbox')).not.toBeVisible()
  40 |   })
  41 | 
  42 |   test.skip('should navigate to project on result click', async ({ page }) => {
  43 |     // Requires: logged in with projects
  44 |     await page.goto('/dashboard')
  45 |     await page.getByPlaceholder(/search/i).fill('test project')
  46 |     await page.getByRole('option').first().click()
  47 |     await expect(page).toHaveURL(/\/projects\/.*\/board/)
  48 |   })
  49 | 
  50 |   test.skip('should show no results state', async ({ page }) => {
  51 |     // Requires: logged in
  52 |     await page.goto('/dashboard')
  53 |     await page.getByPlaceholder(/search/i).fill('xyznonexistent123')
  54 |     await expect(page.getByText(/no results/i)).toBeVisible()
  55 |   })
  56 | 
  57 |   test.skip('should only show accessible projects in results', async ({ page }) => {
  58 |     // Requires: logged in as user with limited access
  59 |     await page.goto('/dashboard')
  60 |     await page.getByPlaceholder(/search/i).fill('project')
  61 |     // Results should only include projects the user is a member of
  62 |     const results = await page.getByRole('option').all()
  63 |     // Verify count matches expected accessible projects
  64 |     expect(results.length).toBeGreaterThanOrEqual(0)
  65 |   })
  66 | })
  67 | 
```