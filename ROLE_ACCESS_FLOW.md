# Role Access Control Flow - Complete Guide

**Date**: May 3, 2026  
**Project**: Team Task Manager

---

## 🔐 When and Where Role Access is Checked

Your application checks role access at **3 different layers** for maximum security:

1. **Database Layer** (Row Level Security - RLS)
2. **API Layer** (Route Handlers)
3. **UI Layer** (Component Rendering)

---

## 📋 Complete Role Access Flow

### 1. User Authentication & Role Assignment

#### When Does a User Get a Role?

**Scenario A: New User Signs Up**
```
User signs up → Account created → NO role assigned yet
```
- New users have NO project roles initially
- They are just authenticated users in the system

**Scenario B: User Creates a Project**
```
User creates project → Automatically becomes ADMIN of that project
```
**File**: `app/api/projects/route.ts`
```typescript
// After project is created
await supabase.from('project_members').insert({
  project_id: project.id,
  user_id: user.id,
  role: 'admin', // ← Creator becomes admin
})
```

**Scenario C: User is Invited to a Project**
```
Admin invites user → User becomes MEMBER of that project
```
**File**: `app/api/projects/[id]/members/route.ts`
```typescript
await supabase.from('project_members').insert({
  project_id: projectId,
  user_id: invitedUser.id,
  role: 'member', // ← Invited users are members by default
})
```

**Scenario D: Admin Promotes Member**
```
Admin changes role → Member becomes ADMIN
```
**File**: `app/api/projects/[id]/members/[memberId]/route.ts`
```typescript
await supabase
  .from('project_members')
  .update({ role: 'admin' }) // ← Role changed
  .eq('user_id', memberId)
```

---

## 🎯 Layer 1: Database Level (RLS Policies)

### When: **EVERY database query**
### Where: **Supabase PostgreSQL**

Role checks happen **automatically** via Row Level Security policies.

#### Example: Tasks Table RLS

**File**: `supabase/migrations/20260502000001_initial_schema.sql`

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
      AND role = 'admin' -- ← Role check here
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
        pm.role = 'admin' -- ← Admin can update anything
        OR (pm.role = 'member' AND tasks.assignee_id = auth.uid()) -- ← Member only own tasks
      )
    )
  );
```

**When This Runs:**
- ✅ Every `SELECT` query
- ✅ Every `INSERT` query
- ✅ Every `UPDATE` query
- ✅ Every `DELETE` query

**Result:**
- Database automatically filters data based on user's role
- Unauthorized queries return empty results or errors
- **Cannot be bypassed** - enforced at database level

---

## 🎯 Layer 2: API Level (Route Handlers)

### When: **Before processing any request**
### Where: **API route handlers**

Role checks happen **explicitly** in API routes before performing actions.

### Example 1: Create Task (Admin Only)

**File**: `app/api/tasks/route.ts`

```typescript
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Step 1: Get user's role in the project
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', body.project_id)
    .eq('user_id', user.id)
    .single()

  // Step 2: Check if user is admin
  if (!membership || membership.role !== 'admin') {
    return NextResponse.json(
      { error: 'You do not have permission to perform this action' },
      { status: 403 } // ← Forbidden
    )
  }

  // Step 3: Proceed with task creation
  const { data: task } = await supabase
    .from('tasks')
    .insert(body)
    .select()
    .single()

  return NextResponse.json(task)
}
```

**When This Runs:**
- ✅ When user clicks "Create Task" button
- ✅ Before task is inserted into database
- ✅ Returns 403 error if not admin

### Example 2: Update Task (Role-Based)

**File**: `app/api/tasks/[id]/route.ts`

```typescript
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  
  // Step 1: Get user's role
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', task.project_id)
    .eq('user_id', user.id)
    .single()

  // Step 2: Admin can update anything
  if (membership.role === 'admin') {
    const validation = updateTaskSchema.safeParse(body)
    // ... update all fields
  }
  
  // Step 3: Member can only update status on their own tasks
  if (membership.role === 'member') {
    // Check if task is assigned to them
    if (task.assignee_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only update tasks assigned to you' },
        { status: 403 }
      )
    }
    
    // Only allow status updates
    const validation = updateStatusSchema.safeParse(body)
    // ... update only status
  }
}
```

**When This Runs:**
- ✅ When user edits a task
- ✅ When user drags a task to different column
- ✅ Before database update
- ✅ Different logic for admin vs member

### Example 3: Delete Project (Admin Only)

**File**: `app/api/projects/[id]/route.ts`

```typescript
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Step 1: Check if user is admin
  const { data: membership } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'admin') {
    return NextResponse.json(
      { error: 'You do not have permission to perform this action' },
      { status: 403 }
    )
  }

  // Step 2: Delete project (cascades to tasks, comments, members)
  await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  return NextResponse.json({ success: true })
}
```

**When This Runs:**
- ✅ When admin clicks "Delete Project"
- ✅ Before project deletion
- ✅ Returns 403 if not admin

---

## 🎯 Layer 3: UI Level (Component Rendering)

### When: **Before rendering UI elements**
### Where: **React components**

Role checks happen to **show/hide** UI elements based on user's role.

### Example 1: Hide "New Task" Button from Members

**File**: `components/tasks/KanbanBoard.tsx`

```typescript
export function KanbanBoard({ projectId, tasks, members, userRole, currentUserId }: KanbanBoardProps) {
  return (
    <div className="space-y-4">
      {/* Only show button if user is admin */}
      {userRole === 'admin' && (
        <div className="flex justify-end">
          <CreateTaskDialog projectId={projectId} members={members} />
        </div>
      )}
      
      {/* Kanban columns */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            tasks={getTasksByStatus(column.id)}
            isAdmin={userRole === 'admin'}
          />
        ))}
      </div>
    </div>
  )
}
```

**When This Runs:**
- ✅ When page loads
- ✅ When component re-renders
- ✅ Admin sees button, Member doesn't

### Example 2: Disable Task Editing for Members

**File**: `components/tasks/TaskDetailSheet.tsx`

```typescript
export function TaskDetailSheet({ task, projectId, userRole, currentUserId, members }: TaskDetailSheetProps) {
  // Calculate permissions
  const canEdit = userRole === 'admin' || (task.assignee?.id === currentUserId)
  const canDelete = userRole === 'admin'
  const canEditAllFields = userRole === 'admin'

  return (
    <Sheet>
      <SheetContent>
        {/* Title - Admin can edit, Member cannot */}
        {canEditAllFields ? (
          <Input value={task.title} onChange={handleTitleChange} />
        ) : (
          <h2>{task.title}</h2>
        )}

        {/* Status - Both can edit (if assigned) */}
        {canEdit && (
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </Select>
        )}

        {/* Delete button - Admin only */}
        {canDelete && (
          <Button variant="destructive" onClick={handleDelete}>
            Delete Task
          </Button>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

**When This Runs:**
- ✅ When task detail sheet opens
- ✅ Admin sees all edit controls
- ✅ Member sees limited controls

### Example 3: Hide Settings Tab from Members

**File**: `app/(dashboard)/projects/[id]/layout.tsx`

```typescript
export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params
  
  // Get user's role in this project
  const userRole = project.project_members[0]?.role

  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          
          {/* Only show Settings tab to admins */}
          {userRole === 'admin' && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
        </TabsList>
      </Tabs>
      
      {children}
    </div>
  )
}
```

**When This Runs:**
- ✅ When project page loads
- ✅ Admin sees 4 tabs
- ✅ Member sees 3 tabs (no Settings)

### Example 4: Prevent Dragging Other's Tasks

**File**: `components/tasks/KanbanBoard.tsx`

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  
  const taskId = active.id as string
  const task = tasks.find(t => t.id === taskId)

  // Check permissions before allowing drag
  if (userRole === 'member' && task.assignee?.id !== currentUserId) {
    toast.error('You can only update tasks assigned to you')
    return // ← Prevent drag
  }

  // Proceed with status update
  await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  })
}
```

**When This Runs:**
- ✅ When user drops a task card
- ✅ Before API call
- ✅ Shows error if member tries to drag someone else's task

---

## 📊 Complete Role Check Timeline

### User Journey: Member Tries to Delete a Task

```
1. UI Layer (Component)
   ├─ Member opens task detail sheet
   ├─ canDelete = userRole === 'admin' → FALSE
   └─ Delete button is HIDDEN ❌

2. If Member Bypasses UI (e.g., using browser console)
   ├─ Member calls: fetch('/api/tasks/123', { method: 'DELETE' })
   └─ Goes to API Layer ↓

3. API Layer (Route Handler)
   ├─ Check membership role
   ├─ membership.role !== 'admin' → TRUE
   ├─ Return 403 Forbidden ❌
   └─ Request BLOCKED

4. If Member Bypasses API (e.g., direct database access)
   ├─ Member tries: DELETE FROM tasks WHERE id = '123'
   └─ Goes to Database Layer ↓

5. Database Layer (RLS Policy)
   ├─ Check RLS policy: "Admins can delete tasks"
   ├─ User role = 'member' → FAIL
   ├─ Database returns error ❌
   └─ Delete BLOCKED
```

**Result**: **Triple-layer security** - Member cannot delete task at any level!

---

## 🔄 Role Check Frequency

### How Often Are Roles Checked?

| Action | UI Check | API Check | DB Check | Total Checks |
|--------|----------|-----------|----------|--------------|
| View task list | ✅ | ❌ | ✅ | 2 |
| Create task | ✅ | ✅ | ✅ | 3 |
| Update task | ✅ | ✅ | ✅ | 3 |
| Delete task | ✅ | ✅ | ✅ | 3 |
| Drag task | ✅ | ✅ | ✅ | 3 |
| View settings | ✅ | ✅ | ✅ | 3 |
| Invite member | ✅ | ✅ | ✅ | 3 |
| Change role | ✅ | ✅ | ✅ | 3 |

**Every action is checked at multiple layers!**

---

## 🎯 Summary: When Role Access is Asked

### 1. **At Page Load**
- Server fetches user's role from `project_members` table
- Role is passed to components as prop
- UI elements show/hide based on role

### 2. **Before User Action**
- User clicks button (e.g., "Create Task")
- Component checks: `if (userRole === 'admin')`
- If not admin, button is disabled or hidden

### 3. **During API Call**
- API route receives request
- Queries database for user's role
- Checks: `if (membership.role !== 'admin') return 403`
- Blocks unauthorized requests

### 4. **At Database Level**
- Database receives query
- RLS policy checks user's role automatically
- Filters/blocks data based on role
- Returns only authorized data

### 5. **On Real-Time Updates**
- Supabase Realtime sends updates
- RLS policies filter updates by role
- User only receives updates they're authorized to see

---

## ✅ Key Takeaways

1. **Roles are project-specific** - A user can be admin in one project and member in another

2. **Roles are checked at 3 layers** - UI, API, and Database

3. **UI checks are for UX** - Hide buttons, show/hide features

4. **API checks are for security** - Block unauthorized requests

5. **Database checks are the final guard** - Cannot be bypassed

6. **Roles are dynamic** - Can be changed by admins at any time

7. **No global admin role** - Only project-level roles exist

---

**Your application has enterprise-grade role-based access control!** 🔒

