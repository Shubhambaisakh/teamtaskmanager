# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: task-management.spec.ts >> Task Management (Public Routes) >> should redirect unauthenticated user from board to login
- Location: __tests__\e2e\task-management.spec.ts:12:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/projects/some-id/board", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | /**
  4  |  * E2E Tests for Task Management
  5  |  * Validates: Requirements 5.1, 6.1, 10.2, 10.3
  6  |  *
  7  |  * Note: Tests marked with test.skip require authenticated sessions.
  8  |  * To run authenticated tests, set up auth state in playwright.config.ts
  9  |  */
  10 | 
  11 | test.describe('Task Management (Public Routes)', () => {
  12 |   test('should redirect unauthenticated user from board to login', async ({ page }) => {
> 13 |     await page.goto('/projects/some-id/board')
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  14 |     await expect(page).toHaveURL(/\/login/)
  15 |   })
  16 | 
  17 |   test('should redirect unauthenticated user from list to login', async ({ page }) => {
  18 |     await page.goto('/projects/some-id/list')
  19 |     await expect(page).toHaveURL(/\/login/)
  20 |   })
  21 | })
  22 | 
  23 | test.describe('Task Management (Authenticated)', () => {
  24 |   // These tests require authentication setup
  25 |   // They document the expected behavior for manual testing
  26 | 
  27 |   test.skip('admin should see "New Task" button on board', async ({ page }) => {
  28 |     // Requires: logged in as admin
  29 |     await page.goto('/projects/test-project-id/board')
  30 |     await expect(page.getByRole('button', { name: /new task/i })).toBeVisible()
  31 |   })
  32 | 
  33 |   test.skip('member should NOT see "New Task" button on board', async ({ page }) => {
  34 |     // Requires: logged in as member
  35 |     await page.goto('/projects/test-project-id/board')
  36 |     await expect(page.getByRole('button', { name: /new task/i })).not.toBeVisible()
  37 |   })
  38 | 
  39 |   test.skip('admin can create a task', async ({ page }) => {
  40 |     // Requires: logged in as admin
  41 |     await page.goto('/projects/test-project-id/board')
  42 |     await page.getByRole('button', { name: /new task/i }).click()
  43 |     await page.getByLabel(/title/i).fill('E2E Test Task')
  44 |     await page.getByRole('button', { name: /create task/i }).click()
  45 |     await expect(page.getByText('E2E Test Task')).toBeVisible()
  46 |   })
  47 | 
  48 |   test.skip('board shows 4 columns', async ({ page }) => {
  49 |     // Requires: logged in
  50 |     await page.goto('/projects/test-project-id/board')
  51 |     await expect(page.getByText('To Do')).toBeVisible()
  52 |     await expect(page.getByText('In Progress')).toBeVisible()
  53 |     await expect(page.getByText('In Review')).toBeVisible()
  54 |     await expect(page.getByText('Done')).toBeVisible()
  55 |   })
  56 | 
  57 |   test.skip('clicking task card opens detail sheet', async ({ page }) => {
  58 |     // Requires: logged in with tasks
  59 |     await page.goto('/projects/test-project-id/board')
  60 |     await page.getByTestId('task-card').first().click()
  61 |     await expect(page.getByText('Task Details')).toBeVisible()
  62 |   })
  63 | 
  64 |   test.skip('list view shows tasks in table', async ({ page }) => {
  65 |     // Requires: logged in with tasks
  66 |     await page.goto('/projects/test-project-id/list')
  67 |     await expect(page.getByRole('table')).toBeVisible()
  68 |     await expect(page.getByRole('columnheader', { name: /title/i })).toBeVisible()
  69 |     await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible()
  70 |     await expect(page.getByRole('columnheader', { name: /priority/i })).toBeVisible()
  71 |   })
  72 | 
  73 |   test.skip('list view filters work', async ({ page }) => {
  74 |     // Requires: logged in with tasks
  75 |     await page.goto('/projects/test-project-id/list')
  76 |     await page.getByRole('combobox', { name: /status/i }).selectOption('in_progress')
  77 |     await expect(page).toHaveURL(/status=in_progress/)
  78 |   })
  79 | 
  80 |   test.skip('admin can delete task from detail sheet', async ({ page }) => {
  81 |     // Requires: logged in as admin with tasks
  82 |     await page.goto('/projects/test-project-id/board')
  83 |     await page.getByTestId('task-card').first().click()
  84 |     await page.getByRole('button', { name: /delete task/i }).click()
  85 |     await page.getByRole('button', { name: /confirm/i }).click()
  86 |     await expect(page.getByText('Task deleted successfully')).toBeVisible()
  87 |   })
  88 | })
  89 | 
```