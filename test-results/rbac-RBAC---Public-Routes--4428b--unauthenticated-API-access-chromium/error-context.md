# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac.spec.ts >> RBAC - Public Routes >> should block unauthenticated API access
- Location: __tests__\e2e\rbac.spec.ts:19:7

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
  4  |  * E2E Tests for RBAC Enforcement
  5  |  * Validates: Requirements 3.5, 4.5, 13.2, 13.3
  6  |  */
  7  | 
  8  | test.describe('RBAC - Public Routes', () => {
  9  |   test('should block unauthenticated access to project settings', async ({ page }) => {
  10 |     await page.goto('/projects/some-id/settings')
  11 |     await expect(page).toHaveURL(/\/login/)
  12 |   })
  13 | 
  14 |   test('should block unauthenticated access to members page', async ({ page }) => {
  15 |     await page.goto('/projects/some-id/members')
  16 |     await expect(page).toHaveURL(/\/login/)
  17 |   })
  18 | 
  19 |   test('should block unauthenticated API access', async ({ page }) => {
  20 |     const response = await page.request.post('/api/tasks', {
  21 |       data: { title: 'Test', project_id: 'some-id' },
  22 |     })
  23 |     // Should return 401 or redirect
> 24 |     expect([401, 302, 307]).toContain(response.status())
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  25 |   })
  26 | 
  27 |   test('should block unauthenticated task deletion', async ({ page }) => {
  28 |     const response = await page.request.delete('/api/tasks/some-task-id')
  29 |     expect([401, 302, 307]).toContain(response.status())
  30 |   })
  31 | })
  32 | 
  33 | test.describe('RBAC - Authenticated (Documented)', () => {
  34 |   test.skip('member cannot access project settings page', async ({ page }) => {
  35 |     // Requires: logged in as member
  36 |     await page.goto('/projects/test-project-id/settings')
  37 |     // Should show 403 message or redirect
  38 |     await expect(page.getByText(/403|not authorized|access denied/i)).toBeVisible()
  39 |   })
  40 | 
  41 |   test.skip('member cannot create tasks via API', async ({ page }) => {
  42 |     // Requires: logged in as member
  43 |     const response = await page.request.post('/api/tasks', {
  44 |       data: {
  45 |         title: 'Unauthorized Task',
  46 |         project_id: 'test-project-id',
  47 |         status: 'todo',
  48 |         priority: 'medium',
  49 |       },
  50 |     })
  51 |     expect(response.status()).toBe(403)
  52 |   })
  53 | 
  54 |   test.skip('member cannot delete tasks via API', async ({ page }) => {
  55 |     // Requires: logged in as member
  56 |     const response = await page.request.delete('/api/tasks/test-task-id')
  57 |     expect(response.status()).toBe(403)
  58 |   })
  59 | 
  60 |   test.skip('member can update status on own assigned task', async ({ page }) => {
  61 |     // Requires: logged in as member with assigned task
  62 |     const response = await page.request.patch('/api/tasks/assigned-task-id', {
  63 |       data: { status: 'in_progress' },
  64 |     })
  65 |     expect(response.status()).toBe(200)
  66 |   })
  67 | 
  68 |   test.skip('member cannot update non-status fields', async ({ page }) => {
  69 |     // Requires: logged in as member with assigned task
  70 |     const response = await page.request.patch('/api/tasks/assigned-task-id', {
  71 |       data: { title: 'New Title' },
  72 |     })
  73 |     expect(response.status()).toBe(403)
  74 |   })
  75 | 
  76 |   test.skip('last admin cannot be removed', async ({ page }) => {
  77 |     // Requires: logged in as admin (only admin in project)
  78 |     await page.goto('/projects/test-project-id/members')
  79 |     // Remove button should be hidden or disabled for last admin
  80 |     const removeButton = page.getByTestId('remove-member-btn').first()
  81 |     await expect(removeButton).not.toBeVisible()
  82 |   })
  83 | 
  84 |   test.skip('admin can invite members', async ({ page }) => {
  85 |     // Requires: logged in as admin
  86 |     await page.goto('/projects/test-project-id/members')
  87 |     await page.getByLabel(/email/i).fill('newmember@example.com')
  88 |     await page.getByRole('button', { name: /invite/i }).click()
  89 |     await expect(page.getByText(/added|invited/i)).toBeVisible()
  90 |   })
  91 | })
  92 | 
```