# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: notifications.spec.ts >> Notifications (Public Routes) >> should redirect unauthenticated notifications API request
- Location: __tests__\e2e\notifications.spec.ts:10:7

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
  4  |  * E2E Tests for Notifications
  5  |  * Validates: Requirements 11.1, 11.2, 11.4
  6  |  * Property 10: Notification Creation
  7  |  */
  8  | 
  9  | test.describe('Notifications (Public Routes)', () => {
  10 |   test('should redirect unauthenticated notifications API request', async ({ page }) => {
  11 |     const response = await page.request.get('/api/notifications')
> 12 |     expect([401, 302, 307]).toContain(response.status())
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  13 |   })
  14 | })
  15 | 
  16 | test.describe('Notifications (Authenticated)', () => {
  17 |   test.skip('should show notification bell in navbar', async ({ page }) => {
  18 |     // Requires: logged in
  19 |     await page.goto('/dashboard')
  20 |     await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible()
  21 |   })
  22 | 
  23 |   test.skip('should show unread count badge when there are unread notifications', async ({ page }) => {
  24 |     // Requires: logged in with unread notifications
  25 |     await page.goto('/dashboard')
  26 |     const badge = page.getByTestId('notification-badge')
  27 |     await expect(badge).toBeVisible()
  28 |   })
  29 | 
  30 |   test.skip('should open notifications dropdown on bell click', async ({ page }) => {
  31 |     // Requires: logged in
  32 |     await page.goto('/dashboard')
  33 |     await page.getByRole('button', { name: /notifications/i }).click()
  34 |     await expect(page.getByText(/notifications/i)).toBeVisible()
  35 |   })
  36 | 
  37 |   test.skip('should mark notification as read on click', async ({ page }) => {
  38 |     // Requires: logged in with unread notifications
  39 |     await page.goto('/dashboard')
  40 |     await page.getByRole('button', { name: /notifications/i }).click()
  41 |     const unreadNotification = page.getByTestId('unread-notification').first()
  42 |     await unreadNotification.click()
  43 |     // Badge count should decrease
  44 |     const badge = page.getByTestId('notification-badge')
  45 |     // After clicking, notification should be marked as read
  46 |   })
  47 | 
  48 |   test.skip('should mark all notifications as read', async ({ page }) => {
  49 |     // Requires: logged in with unread notifications
  50 |     await page.goto('/dashboard')
  51 |     await page.getByRole('button', { name: /notifications/i }).click()
  52 |     await page.getByRole('button', { name: /mark all as read/i }).click()
  53 |     // Badge should disappear
  54 |     await expect(page.getByTestId('notification-badge')).not.toBeVisible()
  55 |   })
  56 | 
  57 |   test.skip('should create notification when task is assigned', async ({ page }) => {
  58 |     // Requires: logged in as admin, another user exists
  59 |     // This tests Property 10: Notification Creation
  60 |     await page.goto('/projects/test-project-id/board')
  61 |     await page.getByRole('button', { name: /new task/i }).click()
  62 |     await page.getByLabel(/title/i).fill('Assigned Task')
  63 |     // Select assignee
  64 |     await page.getByLabel(/assignee/i).selectOption('member-user-id')
  65 |     await page.getByRole('button', { name: /create task/i }).click()
  66 |     // The assigned user should receive a notification
  67 |     // (Verified by checking the notifications API)
  68 |   })
  69 | 
  70 |   test.skip('should show notification message with task info', async ({ page }) => {
  71 |     // Requires: logged in with notifications
  72 |     await page.goto('/dashboard')
  73 |     await page.getByRole('button', { name: /notifications/i }).click()
  74 |     // Notifications should show task title and project name
  75 |     const notification = page.getByTestId('notification-item').first()
  76 |     await expect(notification).toBeVisible()
  77 |   })
  78 | })
  79 | 
```