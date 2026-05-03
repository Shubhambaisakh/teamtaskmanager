# Complete User Flow Testing Guide - Team Task Manager

**Date**: May 3, 2026  
**Purpose**: Comprehensive manual testing of all dashboard features and user flows

---

## Prerequisites

✅ **Server Running**: `http://localhost:3000`  
✅ **Database**: Supabase connected  
✅ **Email**: Resend configured (optional for testing)

---

## Test Flow 1: Authentication & Onboarding

### 1.1 Sign Up Flow
1. Navigate to `http://localhost:3000`
2. Click "Sign Up" or go to `/signup`
3. **Test Cases**:
   - ✅ Empty form submission shows validation errors
   - ✅ Invalid email format shows error
   - ✅ Password < 8 characters shows error
   - ✅ Password mismatch shows error
   - ✅ Valid signup creates account
4. **Expected**: Success message, email confirmation prompt

### 1.2 Login Flow
1. Go to `/login`
2. **Test Cases**:
   - ✅ Empty form shows validation errors
   - ✅ Invalid credentials show error
   - ✅ Valid credentials redirect to `/dashboard`
   - ✅ Google OAuth button works
3. **Expected**: Redirect to dashboard after successful login

### 1.3 Forgot Password
1. Go to `/forgot-password`
2. Enter email
3. **Expected**: Confirmation message (check email for reset link)

### 1.4 Middleware Protection
1. Try accessing `/dashboard` without login
2. **Expected**: Redirect to `/login`
3. Try accessing `/projects` without login
4. **Expected**: Redirect to `/login`

---

## Test Flow 2: Dashboard Overview

### 2.1 Dashboard Stats
1. Navigate to `/dashboard`
2. **Verify 5 Stat Cards**:
   - ✅ Total Projects (count of projects you're a member of)
   - ✅ Total Tasks (assigned to you)
   - ✅ Due Today (tasks due today, not done)
   - ✅ Overdue (tasks past due date, not done)
   - ✅ Completed This Week (tasks completed in last 7 days)

### 2.2 My Tasks Section
1. **Verify Task List**:
   - ✅ Shows only tasks assigned to you
   - ✅ Sorted by due date (overdue first)
   - ✅ Each task shows: project name, title, status, priority, due date
   - ✅ Overdue tasks have red indicator
   - ✅ Tasks due today have amber indicator
2. **Test Filters**:
   - ✅ Click "All" - shows all tasks
   - ✅ Click "Todo" - shows only todo tasks
   - ✅ Click "In Progress" - shows only in-progress tasks
   - ✅ Click "In Review" - shows only in-review tasks
   - ✅ Click "Done" - shows only done tasks
3. **Test Navigation**:
   - ✅ Click on a task - navigates to project board

### 2.3 Project Progress Section
1. **Verify Project List**:
   - ✅ Shows all projects you're a member of
   - ✅ Each project shows progress bar (done/total tasks)
   - ✅ Progress bar color: red < 25%, amber < 75%, green ≥ 75%
   - ✅ Click project - navigates to project board

### 2.4 Empty States
1. If no tasks assigned:
   - ✅ Shows "You're all caught up!" message
2. If no projects:
   - ✅ Shows empty state with "Create Project" button

---

## Test Flow 3: Project Management

### 3.1 Projects List
1. Navigate to `/projects`
2. **Verify**:
   - ✅ Shows all projects you're a member of
   - ✅ Each card shows: name, description, member count, progress bar
   - ✅ Archived projects show "Archived" badge
   - ✅ "New Project" button visible

### 3.2 Create Project
1. Click "New Project" or go to `/projects/new`
2. **Test Cases**:
   - ✅ Empty name shows validation error
   - ✅ Name > 120 chars shows error
   - ✅ Description > 1000 chars shows error
   - ✅ Valid data creates project
3. **Expected**: Redirect to new project board, you are Admin

### 3.3 Project Board (Kanban)
1. Click on a project or go to `/projects/[id]/board`
2. **Verify Layout**:
   - ✅ Project name in header
   - ✅ Tab navigation: Board | List | Members | Settings
   - ✅ Four columns: Todo | In Progress | In Review | Done
   - ✅ Each column shows task count badge
   - ✅ "New Task" button visible (Admin only)

### 3.4 Create Task (Admin Only)
1. Click "New Task" button
2. **Test Form**:
   - ✅ Title required (1-200 chars)
   - ✅ Description optional (≤2000 chars)
   - ✅ Status dropdown (default: todo)
   - ✅ Priority dropdown (default: medium)
   - ✅ Assignee dropdown (project members)
   - ✅ Due date picker
3. **Expected**: Task appears in correct column

### 3.5 Drag & Drop Tasks
1. **Admin Tests**:
   - ✅ Drag any task to different column
   - ✅ Task status updates
   - ✅ Task moves to new column
   - ✅ Realtime update (open in 2 tabs, drag in one, see update in other)
2. **Member Tests**:
   - ✅ Can drag own assigned tasks
   - ✅ Cannot drag tasks assigned to others (shows error)

### 3.6 Task Detail Sheet
1. Click on any task card
2. **Verify Sheet Opens**:
   - ✅ Shows full title
   - ✅ Shows description
   - ✅ Status selector (Admin: all tasks, Member: own tasks only)
   - ✅ Priority selector (Admin only)
   - ✅ Assignee selector (Admin only)
   - ✅ Due date picker (Admin only)
   - ✅ "Delete Task" button (Admin only)
   - ✅ Comments section below
3. **Test Editing**:
   - ✅ Admin can edit all fields
   - ✅ Member can only edit status on own tasks
   - ✅ Changes save and reflect immediately

### 3.7 Task Comments
1. In task detail sheet, scroll to comments
2. **Test Create Comment**:
   - ✅ Type comment (1-2000 chars)
   - ✅ Click "Post" - comment appears
   - ✅ Shows avatar, name, timestamp
3. **Test Edit Comment**:
   - ✅ Click edit on own comment
   - ✅ Update text
   - ✅ Shows "(edited)" label
4. **Test Delete Comment**:
   - ✅ Click delete on own comment
   - ✅ Shows "This comment was deleted" placeholder
   - ✅ Admin can delete any comment

### 3.8 List View
1. Click "List" tab or go to `/projects/[id]/list`
2. **Verify Table**:
   - ✅ Columns: Title, Status, Priority, Assignee, Due Date, Overdue
   - ✅ All tasks shown in table format
   - ✅ Overdue indicator visible
3. **Test Sorting**:
   - ✅ Click column header - sorts ascending
   - ✅ Click again - sorts descending
4. **Test Filtering**:
   - ✅ Status filter dropdown - filters by status
   - ✅ Priority filter dropdown - filters by priority
   - ✅ Filters work together
   - ✅ URL updates with filter params (bookmarkable)
5. **Test Navigation**:
   - ✅ Click row - opens task detail sheet

### 3.9 Members Page
1. Click "Members" tab or go to `/projects/[id]/members`
2. **Verify Member List**:
   - ✅ Shows all project members
   - ✅ Each row: avatar, name, email, role badge, joined date
3. **Admin Tests**:
   - ✅ "Invite Member" form visible
   - ✅ Role dropdown visible for each member
   - ✅ Remove button visible (except last admin)
4. **Member Tests**:
   - ✅ Read-only view (no invite form, no controls)

### 3.10 Invite Member (Admin Only)
1. Enter email in invite form
2. **Test Cases**:
   - ✅ Invalid email shows error
   - ✅ Non-existent user shows error
   - ✅ Already a member shows error
   - ✅ Valid email adds member (default role: member)
3. **Expected**: New member appears in list immediately

### 3.11 Change Member Role (Admin Only)
1. Click role dropdown for a member
2. **Test Cases**:
   - ✅ Change member to admin - updates immediately
   - ✅ Change admin to member - updates immediately
   - ✅ Last admin cannot be changed to member (option disabled)

### 3.12 Remove Member (Admin Only)
1. Click remove button for a member
2. **Test Cases**:
   - ✅ Confirmation dialog appears
   - ✅ Confirm - member removed from list
   - ✅ Last admin cannot be removed (button hidden)

### 3.13 Project Settings (Admin Only)
1. Click "Settings" tab or go to `/projects/[id]/settings`
2. **Member Test**:
   - ✅ Redirected away with 403 message
3. **Admin Tests**:
   - ✅ Edit project name and description
   - ✅ "Archive Project" button visible
   - ✅ "Delete Project" button visible

### 3.14 Archive Project (Admin Only)
1. Click "Archive Project"
2. **Expected**:
   - ✅ Confirmation dialog
   - ✅ Project marked as archived
   - ✅ Shows "Archived" badge on project card
   - ✅ Can unarchive by clicking again

### 3.15 Delete Project (Admin Only)
1. Click "Delete Project"
2. **Expected**:
   - ✅ Confirmation dialog with warning
   - ✅ Confirm - project deleted
   - ✅ All tasks, comments, members deleted (cascade)
   - ✅ Redirect to projects list

---

## Test Flow 4: Notifications

### 4.1 Notification Bell
1. Look at navbar
2. **Verify**:
   - ✅ Bell icon visible
   - ✅ Unread count badge visible (if unread notifications)
   - ✅ Badge hidden when count = 0

### 4.2 Notification Dropdown
1. Click bell icon
2. **Verify**:
   - ✅ Dropdown opens
   - ✅ Shows last 20 notifications
   - ✅ Unread notifications highlighted
   - ✅ Each notification shows: icon, message, time
   - ✅ "Mark all as read" button visible

### 4.3 Notification Types
1. **Task Assigned**:
   - ✅ Admin assigns task to you
   - ✅ Notification appears: "You were assigned to [task] in [project]"
2. **Comment Added**:
   - ✅ Someone comments on your task
   - ✅ Notification appears: "[User] commented on [task]"

### 4.4 Mark as Read
1. Click on a notification
2. **Expected**:
   - ✅ Notification marked as read
   - ✅ Unread count decreases
   - ✅ Navigates to task

### 4.5 Mark All as Read
1. Click "Mark all as read"
2. **Expected**:
   - ✅ All notifications marked as read
   - ✅ Badge count becomes 0
   - ✅ Badge hidden

### 4.6 Realtime Updates
1. Open app in 2 browser tabs
2. In tab 1: assign a task to yourself
3. In tab 2:
   - ✅ Notification appears within 2 seconds
   - ✅ Badge count updates

---

## Test Flow 5: Global Search

### 5.1 Search Input
1. Look at navbar
2. **Verify**:
   - ✅ Search input visible
   - ✅ Placeholder: "Search projects and tasks..."

### 5.2 Search Functionality
1. Type in search input (min 3 characters)
2. **Verify**:
   - ✅ Results dropdown appears after 300ms debounce
   - ✅ Shows matching projects and tasks
   - ✅ Each result shows: icon, title, project name (for tasks)
   - ✅ Highlights search term

### 5.3 Search Results
1. **Test Cases**:
   - ✅ Type "test" - shows projects/tasks with "test" in name
   - ✅ Type < 3 chars - no results shown
   - ✅ Type non-existent term - shows "No results" message
   - ✅ Only shows projects/tasks you have access to

### 5.4 Navigate from Search
1. Click on a search result
2. **Expected**:
   - ✅ Project result - navigates to project board
   - ✅ Task result - navigates to project board with task detail open

---

## Test Flow 6: User Settings

### 6.1 Profile Settings
1. Click user avatar in navbar
2. Click "Settings" or go to `/settings`
3. **Verify Form**:
   - ✅ Full name field (pre-filled)
   - ✅ Email field (read-only)
   - ✅ Avatar upload (optional)
4. **Test Update**:
   - ✅ Change full name
   - ✅ Save - updates immediately
   - ✅ Avatar updates in navbar

### 6.2 Sign Out
1. Click user avatar in navbar
2. Click "Sign Out"
3. **Expected**:
   - ✅ Logged out
   - ✅ Redirect to `/login`
   - ✅ Cannot access protected routes

---

## Test Flow 7: RBAC (Role-Based Access Control)

### 7.1 Admin Permissions
**Admin can**:
- ✅ Create tasks
- ✅ Edit all task fields
- ✅ Delete tasks
- ✅ Drag any task
- ✅ Invite members
- ✅ Change member roles
- ✅ Remove members (except last admin)
- ✅ Access project settings
- ✅ Archive/delete project
- ✅ Delete any comment

### 7.2 Member Permissions
**Member can**:
- ✅ View all tasks
- ✅ Update status on own assigned tasks
- ✅ Drag own assigned tasks
- ✅ Comment on tasks
- ✅ Edit/delete own comments
- ✅ View members list

**Member cannot**:
- ❌ Create tasks (button hidden)
- ❌ Edit task fields except status on own tasks
- ❌ Delete tasks
- ❌ Drag tasks not assigned to them
- ❌ Invite members (form hidden)
- ❌ Change member roles (dropdown hidden)
- ❌ Remove members (button hidden)
- ❌ Access project settings (403 redirect)
- ❌ Archive/delete project
- ❌ Delete others' comments

### 7.3 Last Admin Protection
1. Create project with 2 admins
2. Try to remove one admin
3. **Expected**: ✅ Works
4. Try to remove last admin
5. **Expected**: ❌ Button hidden, shows error if attempted via API

---

## Test Flow 8: Realtime Features

### 8.1 Task Updates
1. Open project board in 2 tabs
2. In tab 1: drag task to different column
3. In tab 2:
   - ✅ Task moves to new column within 2 seconds

### 8.2 Notifications
1. Open app in 2 tabs
2. In tab 1: assign task to yourself
3. In tab 2:
   - ✅ Notification badge updates within 2 seconds

### 8.3 Comments
1. Open task detail in 2 tabs
2. In tab 1: add comment
3. In tab 2:
   - ✅ Comment appears within 2 seconds

---

## Test Flow 9: Responsive Design

### 9.1 Mobile View (< 768px)
1. Resize browser to mobile width
2. **Verify**:
   - ✅ Sidebar collapses to hamburger menu
   - ✅ Kanban board scrolls horizontally
   - ✅ Task cards stack vertically
   - ✅ Forms are full-width
   - ✅ Tables scroll horizontally

### 9.2 Tablet View (768px - 1024px)
1. Resize browser to tablet width
2. **Verify**:
   - ✅ Sidebar visible but narrower
   - ✅ Kanban columns fit 2-3 per row
   - ✅ Forms are centered

### 9.3 Desktop View (> 1024px)
1. Resize browser to desktop width
2. **Verify**:
   - ✅ Full sidebar visible
   - ✅ All 4 kanban columns visible
   - ✅ Forms are centered with max-width

---

## Test Flow 10: Error Handling

### 10.1 Network Errors
1. Disconnect internet
2. Try to create task
3. **Expected**: ✅ Error message shown

### 10.2 Validation Errors
1. Try to submit forms with invalid data
2. **Expected**: ✅ Inline error messages shown

### 10.3 Permission Errors
1. As member, try to access `/projects/[id]/settings`
2. **Expected**: ✅ 403 error, redirect with message

### 10.4 Not Found Errors
1. Navigate to `/projects/invalid-id`
2. **Expected**: ✅ 404 page shown

---

## Test Flow 11: Performance

### 11.1 Page Load Times
- ✅ Dashboard loads < 2 seconds
- ✅ Project board loads < 2 seconds
- ✅ List view loads < 2 seconds

### 11.2 Search Performance
- ✅ Search results appear < 500ms after typing

### 11.3 Realtime Updates
- ✅ Updates appear < 2 seconds

---

## Test Checklist Summary

### ✅ Authentication (10 tests)
- Sign up, login, forgot password, OAuth, middleware protection

### ✅ Dashboard (15 tests)
- Stats, my tasks, project progress, filters, empty states

### ✅ Projects (25 tests)
- List, create, board, tasks, drag-drop, detail, comments, list view

### ✅ Members (10 tests)
- List, invite, role change, remove, last-admin protection

### ✅ Settings (5 tests)
- Project settings, archive, delete, profile settings

### ✅ Notifications (10 tests)
- Bell, dropdown, types, mark as read, realtime

### ✅ Search (8 tests)
- Input, results, navigation, access control

### ✅ RBAC (20 tests)
- Admin permissions, member permissions, last-admin protection

### ✅ Realtime (6 tests)
- Task updates, notifications, comments

### ✅ Responsive (6 tests)
- Mobile, tablet, desktop

### ✅ Error Handling (8 tests)
- Network, validation, permissions, not found

### ✅ Performance (6 tests)
- Load times, search, realtime

---

## **Total Tests: 129 Manual Test Cases**

---

## Quick Test Script

For a quick smoke test, run through this abbreviated flow:

1. ✅ Sign up / Login
2. ✅ View dashboard (verify stats)
3. ✅ Create project
4. ✅ Create task (admin)
5. ✅ Drag task to different column
6. ✅ Open task detail, add comment
7. ✅ Switch to list view, test filters
8. ✅ Invite member
9. ✅ Test member permissions (in incognito window)
10. ✅ Test notifications
11. ✅ Test search
12. ✅ Sign out

**Time**: ~15 minutes for quick smoke test  
**Time**: ~2 hours for complete manual testing

---

## Automated Testing

To run automated E2E tests (requires Playwright browsers):

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## Bug Reporting Template

If you find any issues during testing:

```markdown
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: [If applicable]

**Browser**: [Chrome/Firefox/Safari]

**User Role**: [Admin/Member]

**Severity**: [Critical/High/Medium/Low]
```

---

**Happy Testing!** 🎉
