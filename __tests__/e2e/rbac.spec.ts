import { test, expect } from '@playwright/test'

/**
 * E2E Tests for RBAC Enforcement
 * Validates: Requirements 3.5, 4.5, 13.2, 13.3
 */

test.describe('RBAC - Public Routes', () => {
  test('should block unauthenticated access to project settings', async ({ page }) => {
    await page.goto('/projects/some-id/settings')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should block unauthenticated access to members page', async ({ page }) => {
    await page.goto('/projects/some-id/members')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should block unauthenticated API access', async ({ page }) => {
    const response = await page.request.post('/api/tasks', {
      data: { title: 'Test', project_id: 'some-id' },
    })
    // Should return 401 or redirect
    expect([401, 302, 307]).toContain(response.status())
  })

  test('should block unauthenticated task deletion', async ({ page }) => {
    const response = await page.request.delete('/api/tasks/some-task-id')
    expect([401, 302, 307]).toContain(response.status())
  })
})

test.describe('RBAC - Authenticated (Documented)', () => {
  test.skip('member cannot access project settings page', async ({ page }) => {
    // Requires: logged in as member
    await page.goto('/projects/test-project-id/settings')
    // Should show 403 message or redirect
    await expect(page.getByText(/403|not authorized|access denied/i)).toBeVisible()
  })

  test.skip('member cannot create tasks via API', async ({ page }) => {
    // Requires: logged in as member
    const response = await page.request.post('/api/tasks', {
      data: {
        title: 'Unauthorized Task',
        project_id: 'test-project-id',
        status: 'todo',
        priority: 'medium',
      },
    })
    expect(response.status()).toBe(403)
  })

  test.skip('member cannot delete tasks via API', async ({ page }) => {
    // Requires: logged in as member
    const response = await page.request.delete('/api/tasks/test-task-id')
    expect(response.status()).toBe(403)
  })

  test.skip('member can update status on own assigned task', async ({ page }) => {
    // Requires: logged in as member with assigned task
    const response = await page.request.patch('/api/tasks/assigned-task-id', {
      data: { status: 'in_progress' },
    })
    expect(response.status()).toBe(200)
  })

  test.skip('member cannot update non-status fields', async ({ page }) => {
    // Requires: logged in as member with assigned task
    const response = await page.request.patch('/api/tasks/assigned-task-id', {
      data: { title: 'New Title' },
    })
    expect(response.status()).toBe(403)
  })

  test.skip('last admin cannot be removed', async ({ page }) => {
    // Requires: logged in as admin (only admin in project)
    await page.goto('/projects/test-project-id/members')
    // Remove button should be hidden or disabled for last admin
    const removeButton = page.getByTestId('remove-member-btn').first()
    await expect(removeButton).not.toBeVisible()
  })

  test.skip('admin can invite members', async ({ page }) => {
    // Requires: logged in as admin
    await page.goto('/projects/test-project-id/members')
    await page.getByLabel(/email/i).fill('newmember@example.com')
    await page.getByRole('button', { name: /invite/i }).click()
    await expect(page.getByText(/added|invited/i)).toBeVisible()
  })
})
