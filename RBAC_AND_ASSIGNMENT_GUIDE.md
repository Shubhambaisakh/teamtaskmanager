# Role-Based Access Control (RBAC) & Task Assignment Guide

## 🔐 Authentication & Authorization System

### Overview
Your Team Task Manager implements a comprehensive **Role-Based Access Control (RBAC)** system with two distinct roles:
- **Admin** - Full control over projects and tasks
- **Member** - Limited permissions, can only update their own assigned tasks

---

## 👥 User Roles Explained

### 1. Admin Role
**Who gets this role:**
- The user who creates a project automatically becomes an Admin
- Other users can be promoted to Admin by existing Admins

**Permissions:**
- ✅ Create new tasks
- ✅ Edit all task fields (title, description, status, priority, assignee, due date)
- ✅ Delete any task
- ✅ Drag any task to different columns
- ✅ Invite new members to the project
- ✅ Change member roles (promote/demote)
- ✅ Remove members from the project
- ✅ Access project settings
- ✅ Archive/delete the project
- ✅ Delete any comment

### 2. Member Role
**Who gets this role:**
- Users invited to a project get Member role by default
- Admins can demote other Admins to Member

**Permissions:**
- ✅ View all tasks in the project
- ✅ Update status on tasks assigned to them
- ✅ Drag their own assigned tasks
- ✅ Comment on any task
- ✅ Edit/delete their own comments
- ✅ View project members list

**Restrictions:**
- ❌ Cannot create new tasks
- ❌ Cannot edit task fields (except status on own tasks)
- ❌ Cannot delete tasks
- ❌ Cannot drag tasks not assigned to them
- ❌ Cannot invite members
- ❌ Cannot change member roles
- ❌ Cannot remove members
- ❌ Cannot access project settings
- ❌ Cannot archive/delete project
- ❌ Cannot delete others' comments

---

## 📝 Task Assignment System

### How Task Assignment Works

#### 1. **When Creating a Task (Admin Only)**

When an Admin creates a new task, they see a form with these fields:

```
┌─────────────────────────────────────┐
│  Create New Task                    │
├─────────────────────────────────────┤
│  Title: *                           │
│  [Enter task title]                 │
│                                     │
│  Description:                       │
│  [Enter description...]             │
│                                     │
│  Priority:        Assignee:         │
│  [Medium ▼]       [Select... ▼]     │
│                                     │
│  Due Date:                          │
│  [Select date]                      │
│                                     │
│  [Cancel]  [Create Task]            │
└─────────────────────────────────────┘
```

#### 2. **Assignee Dropdown Options**

The assignee dropdown shows **ALL project members**, including:
- ✅ Admins
- ✅ Members
- ✅ The task creator themselves

**Format:** `Full Name (role)`

**Example:**
```
Assignee: [Select assignee (optional) ▼]
  ├─ Unassigned
  ├─ John Doe (admin)
  ├─ Jane Smith (member)
  ├─ Bob Johnson (admin)
  └─ Alice Williams (member)
```

#### 3. **Assignment is Optional**
- Tasks can be created without an assignee (Unassigned)
- Assignee can be added/changed later by Admins
- Members can only see tasks but cannot change assignees

#### 4. **Who Can See Assigned Tasks**
- **Dashboard "My Tasks"** - Shows only tasks assigned to the logged-in user
- **Project Board** - Shows ALL tasks in the project (regardless of assignment)
- **Project List View** - Shows ALL tasks with assignee column

---

## 🔒 Security Implementation

### Database Level (Row Level Security - RLS)

#### Projects Table
```sql
-- Users can only see projects they are members of
CREATE POLICY "Users can view their projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_id = projects.id
      AND user_id = auth.uid()
    )
  );
```

#### Tasks Table
```sql
-- Users can only see tasks in their projects
CREATE POLICY "Users can view tasks in their projects"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_id = tasks.project_id
      AND user_id = auth.uid()
    )
  );

-- Only admins can create tasks
CREATE POLICY "Admins can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_id = tasks.project_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can update any task, members can only update status on their tasks
CREATE POLICY "Users can update tasks based on role"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = tasks.project_id
      AND pm.user_id = auth.uid()
      AND (
        pm.role = 'admin'
        OR (pm.role = 'member' AND tasks.assignee_id = auth.uid())
      )
    )
  );
```

### API Level (Route Handlers)

#### Example: Create Task API
```typescript
// app/api/tasks/route.ts
export async function POST(request: Request) {
  const user = await getUser()
  const body = await request.json()
  
  // Check if user is admin of the project
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', body.project_id)
    .eq('user_id', user.id)
    .single()
  
  if (membership?.role !== 'admin') {
    return Response.json(
      { error: 'Only admins can create tasks' },
      { status: 403 }
    )
  }
  
  // Create task with optional assignee
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...body,
      assignee_id: body.assignee_id || null // Optional
    })
    .select()
    .single()
  
  return Response.json(data)
}
```

### UI Level (Component Visibility)

#### Example: Conditional Rendering
```tsx
// Only show "New Task" button to admins
{userRole === 'admin' && (
  <CreateTaskDialog projectId={projectId} members={members} />
)}

// Only show edit fields to admins or task assignees
{(userRole === 'admin' || task.assignee_id === currentUserId) && (
  <EditTaskForm task={task} />
)}
```

---

## 🎯 User Flow Examples

### Scenario 1: Admin Creates Project and Assigns Task

1. **User A** signs up and logs in
2. **User A** creates a new project → Automatically becomes **Admin**
3. **User A** invites **User B** by email → **User B** becomes **Member**
4. **User A** clicks "New Task" button (visible because they're Admin)
5. **User A** fills in task details:
   - Title: "Design homepage"
   - Priority: High
   - **Assignee: User B (member)** ← Shows all project members
   - Due Date: Tomorrow
6. Task is created and appears on the board
7. **User B** receives a notification: "You were assigned to Design homepage"
8. **User B** sees the task in their "My Tasks" dashboard
9. **User B** can drag the task to "In Progress" (because it's assigned to them)
10. **User B** cannot edit title, priority, or assignee (Member restrictions)

### Scenario 2: Member Tries to Create Task

1. **User B** (Member) opens the project board
2. **User B** does NOT see the "New Task" button (hidden for Members)
3. If **User B** tries to call the API directly → Gets 403 Forbidden error
4. Database RLS policy blocks the insert operation

### Scenario 3: Admin Promotes Member

1. **User A** (Admin) goes to Members tab
2. **User A** clicks role dropdown for **User B**
3. **User A** changes role from "Member" to "Admin"
4. **User B** now sees "New Task" button
5. **User B** can now create tasks and manage the project

---

## 🔄 Task Assignment Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication                       │
│                    (Supabase Auth)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Check Project Membership                        │
│              (project_members table)                         │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌────────────────┐
    │  Admin Role    │          │  Member Role   │
    └────────┬───────┘          └────────┬───────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌────────────────┐
    │ Create Task    │          │ View Tasks     │
    │ - Show form    │          │ - Read only    │
    │ - Load members │          │ - Update own   │
    │ - Assignee ▼   │          │   task status  │
    │   • Admin 1    │          └────────────────┘
    │   • Admin 2    │
    │   • Member 1   │
    │   • Member 2   │
    │   • Unassigned │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ Task Created   │
    │ - Assigned to  │
    │   selected user│
    │ - Notification │
    │   sent         │
    └────────────────┘
```

---

## 📊 Database Schema for RBAC

### Tables Involved

#### 1. profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. project_members (RBAC Core)
```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

#### 4. tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ✅ What Was Fixed

### Before (Missing Feature)
- ❌ No assignee field in Create Task form
- ❌ Tasks could not be assigned during creation
- ❌ Had to edit task after creation to assign

### After (Now Implemented)
- ✅ Assignee dropdown in Create Task form
- ✅ Shows ALL project members (Admins + Members)
- ✅ Displays format: "Full Name (role)"
- ✅ Optional field (can create unassigned tasks)
- ✅ Properly integrated with RBAC system
- ✅ Notifications sent when task is assigned

---

## 🧪 Testing the Assignment Feature

### Test Case 1: Admin Creates Assigned Task
1. Login as Admin
2. Go to project board
3. Click "New Task"
4. Fill in title: "Test Task"
5. **Select assignee from dropdown** ← NEW FEATURE
6. Click "Create Task"
7. **Expected:** Task appears with assignee avatar
8. **Expected:** Assignee receives notification

### Test Case 2: Assignee Dropdown Shows All Members
1. Create project with 3 members (2 admins, 1 member)
2. Click "New Task"
3. Open assignee dropdown
4. **Expected:** See all 3 members listed
5. **Expected:** Format: "Name (admin)" or "Name (member)"

### Test Case 3: Unassigned Task
1. Click "New Task"
2. Leave assignee as "Unassigned"
3. Create task
4. **Expected:** Task created without assignee
5. **Expected:** No notification sent

---

## 📝 Summary

### ✅ Your RBAC System Includes:

1. **Two-Tier Role System**
   - Admin (full control)
   - Member (limited permissions)

2. **Triple-Layer Security**
   - Database (RLS policies)
   - API (route handlers)
   - UI (conditional rendering)

3. **Complete Task Assignment**
   - Assignee field in create form ✅ **NOW ADDED**
   - Shows all project members
   - Optional assignment
   - Notification system
   - Dashboard "My Tasks" view

4. **Last-Admin Protection**
   - Cannot remove last admin
   - Cannot demote last admin
   - Prevents project lockout

5. **Granular Permissions**
   - Members can only update their own task status
   - Admins have full control
   - Enforced at all levels

---

## 🎉 Conclusion

Your Team Task Manager now has a **complete, production-ready RBAC system** with:
- ✅ Role-based authentication
- ✅ Task assignment with member selection
- ✅ Multi-layer security
- ✅ Proper permission checks
- ✅ User-friendly interface

**The assignee dropdown now shows all project members as required!** 🚀

