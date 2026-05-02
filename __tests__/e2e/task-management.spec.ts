import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Task Management
 * Validates: Requirements 5.1, 6.1, 10.2, 10.3
 *
 * Note: Tests marked with test.skip require authenticated sessions.
 * To run authenticated tests, set up auth state in playwright.config.ts
 */

test.describe('Task Management (Public Routes)', () => {
  test('should redirect unauthenticated user from board to login', async ({ page }) => {
    await page.goto('/projects/some-id/board')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect unauthenticated user from list to login', async ({ page }) => {
    await page.goto('/projects/some-id/list')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Task Management (Authenticated)', () => {
  // These tests require authentication setup
  // They document the expected behavior for manual testing

  test.skip('admin should see "New Task" button on board', async ({ page }) => {
    // Requires: logged in as admin
    await page.goto('/projects/test-project-id/board')
    await expect(page.getByRole('button', { name: /new task/i })).toBeVisible()
  })

  test.skip('member should NOT see "New Task" button on board', async ({ page }) => {
    // Requires: logged in as member
    await page.goto('/projects/test-project-id/board')
    await expect(page.getByRole('button', { name: /new task/i })).not.toBeVisible()
  })

  test.skip('admin can create a task', async ({ page }) => {
    // Requires: logged in as admin
    await page.goto('/projects/test-project-id/board')
    await page.getByRole('button', { name: /new task/i }).click()
    await page.getByLabel(/title/i).fill('E2E Test Task')
    await page.getByRole('button', { name: /create task/i }).click()
    await expect(page.getByText('E2E Test Task')).toBeVisible()
  })

  test.skip('board shows 4 columns', async ({ page }) => {
    // Requires: logged in
    await page.goto('/projects/test-project-id/board')
    await expect(page.getByText('To Do')).toBeVisible()
    await expect(page.getByText('In Progress')).toBeVisible()
    await expect(page.getByText('In Review')).toBeVisible()
    await expect(page.getByText('Done')).toBeVisible()
  })

  test.skip('clicking task card opens detail sheet', async ({ page }) => {
    // Requires: logged in with tasks
    await page.goto('/projects/test-project-id/board')
    await page.getByTestId('task-card').first().click()
    await expect(page.getByText('Task Details')).toBeVisible()
  })

  test.skip('list view shows tasks in table', async ({ page }) => {
    // Requires: logged in with tasks
    await page.goto('/projects/test-project-id/list')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /title/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /priority/i })).toBeVisible()
  })

  test.skip('list view filters work', async ({ page }) => {
    // Requires: logged in with tasks
    await page.goto('/projects/test-project-id/list')
    await page.getByRole('combobox', { name: /status/i }).selectOption('in_progress')
    await expect(page).toHaveURL(/status=in_progress/)
  })

  test.skip('admin can delete task from detail sheet', async ({ page }) => {
    // Requires: logged in as admin with tasks
    await page.goto('/projects/test-project-id/board')
    await page.getByTestId('task-card').first().click()
    await page.getByRole('button', { name: /delete task/i }).click()
    await page.getByRole('button', { name: /confirm/i }).click()
    await expect(page.getByText('Task deleted successfully')).toBeVisible()
  })
})
