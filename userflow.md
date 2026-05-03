# Team Task Manager — User Flow

---

## 1. Entry Point

All users land on the app entry screen. The system checks for an active session or token.

- **Not authenticated** → redirect to Login / Signup
- **Authenticated** → proceed to Role Check

---

## 2. Authentication

### Signup
- Enter name, email, password
- Validate inputs (unique email, password strength)
- Account created with default role: **Member**
- Admin accounts are assigned manually or via invite

### Login
- Enter email + password
- Server validates credentials
- On success → JWT / session token issued
- On failure → show error, allow retry

---

## 3. Role Check

After authentication, the system reads the user's role and routes accordingly.

| Role   | Redirected To       |
|--------|---------------------|
| Admin  | Admin Dashboard     |
| Member | Member Dashboard    |

---

## 4. Admin Flow

### 4.1 Admin Dashboard
- Overview of all projects, tasks, and team members
- Stats: total tasks, completed, in progress, overdue

### 4.2 Create Project
- Enter project name, description, and deadline
- Project saved and visible to assigned members

### 4.3 Manage Team
- Invite members by email
- Assign roles (Admin / Member)
- Remove members from a project

### 4.4 Create Task
- Select project
- Enter task title, description, priority (Low / Medium / High)
- Assign to a team member
- Set due date

### 4.5 Monitor Progress
- View all tasks by status: Todo / In Progress / Done
- See overdue tasks highlighted
- Filter by project, member, or priority

### 4.6 Edit / Delete
- Edit task details, reassign, or change deadline
- Delete tasks or entire projects
- Only Admins can perform delete operations

---

## 5. Member Flow

### 5.1 Member Dashboard
- Shows only tasks and projects assigned to the logged-in member

### 5.2 View Assigned Tasks
- Filter by project, status, or due date
- See task details: description, priority, deadline, assignee

### 5.3 Update Task Status
- Move task through: **Todo → In Progress → Done**
- One-click status update from dashboard

### 5.4 Add Comments
- Leave task-level comments for discussion
- View comment history per task

### 5.5 View Project Board
- Kanban or list view of the project
- Read-only for members (no edit/delete access)

---

## 6. Shared Features (Both Roles)

### 6.1 Shared Dashboard
- Unified view of task statuses and overdue items
- Admins see all; Members see their own

### 6.2 Notifications
- Deadline reminders
- New task assignments
- Status change updates

### 6.3 Profile & Settings
- Edit display name and profile picture
- Change password
- View account role

### 6.4 Logout
- Session/token invalidated
- Redirect to Login screen

---

## 7. Role-Based Access Control Summary

| Action                  | Admin | Member |
|-------------------------|:-----:|:------:|
| Create project          | ✅    | ❌     |
| Delete project          | ✅    | ❌     |
| Invite / remove members | ✅    | ❌     |
| Create task             | ✅    | ❌     |
| Assign task             | ✅    | ❌     |
| Edit task               | ✅    | ❌     |
| Delete task             | ✅    | ❌     |
| Update task status      | ✅    | ✅     |
| Add comments            | ✅    | ✅     |
| View project board      | ✅    | ✅     |
| View dashboard          | ✅    | ✅     |
| Edit own profile        | ✅    | ✅     |

---

## 8. Task Status Lifecycle

```
Todo → In Progress → Done
         ↑               |
         └───────────────┘  (reopen if needed)
```

---

## 9. API Endpoints Reference (REST)

| Method | Endpoint                        | Role         | Description              |
|--------|---------------------------------|--------------|--------------------------|
| POST   | /api/auth/signup                | Public       | Register new user        |
| POST   | /api/auth/login                 | Public       | Login and get token      |
| GET    | /api/projects                   | Both         | List projects            |
| POST   | /api/projects                   | Admin        | Create project           |
| DELETE | /api/projects/:id               | Admin        | Delete project           |
| POST   | /api/projects/:id/members       | Admin        | Add member to project    |
| GET    | /api/tasks                      | Both         | List tasks               |
| POST   | /api/tasks                      | Admin        | Create task              |
| PATCH  | /api/tasks/:id/status           | Both         | Update task status       |
| DELETE | /api/tasks/:id                  | Admin        | Delete task              |
| POST   | /api/tasks/:id/comments         | Both         | Add comment              |

---

*Generated for: Team Task Manager (Full-Stack Assessment)*