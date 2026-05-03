# Quick Test Checklist - Team Task Manager

**Time**: 15-20 minutes  
**Purpose**: Rapid smoke test of all major features

---

## ✅ Pre-Test Setup

- [ ] Server running: `http://localhost:3000`
- [ ] Database connected (Supabase)
- [ ] Browser: Chrome/Firefox (latest)

---

## 🔐 1. Authentication (3 min)

### Sign Up
- [ ] Go to `/signup`
- [ ] Fill form: name, email, password
- [ ] Click "Sign Up"
- [ ] ✅ Success message shown

### Login
- [ ] Go to `/login`
- [ ] Enter email & password
- [ ] Click "Sign In"
- [ ] ✅ Redirected to `/dashboard`

---

## 📊 2. Dashboard (2 min)

- [ ] ✅ See 5 stat cards (Projects, Tasks, Due Today, Overdue, Completed)
- [ ] ✅ See "My Tasks" section
- [ ] ✅ See "Project Progress" section
- [ ] ✅ Click filter buttons (All, Todo, In Progress, etc.)

---

## 📁 3. Create Project (2 min)

- [ ] Click "Projects" in sidebar
- [ ] Click "New Project"
- [ ] Enter name: "Test Project"
- [ ] Enter description: "Testing all features"
- [ ] Click "Create"
- [ ] ✅ Redirected to project board

---

## ✅ 4. Create Task (Admin) (2 min)

- [ ] Click "New Task" button
- [ ] Enter title: "Test Task 1"
- [ ] Select status: "Todo"
- [ ] Select priority: "High"
- [ ] Select assignee: yourself
- [ ] Set due date: tomorrow
- [ ] Click "Create"
- [ ] ✅ Task appears in "Todo" column

---

## 🎯 5. Drag & Drop (1 min)

- [ ] Drag "Test Task 1" to "In Progress" column
- [ ] ✅ Task moves to new column
- [ ] ✅ Status updated

---

## 💬 6. Task Detail & Comments (2 min)

- [ ] Click on "Test Task 1"
- [ ] ✅ Detail sheet opens
- [ ] Scroll to comments
- [ ] Type comment: "Testing comments"
- [ ] Click "Post"
- [ ] ✅ Comment appears
- [ ] Click edit, change text
- [ ] ✅ Shows "(edited)" label

---

## 📋 7. List View & Filters (2 min)

- [ ] Click "List" tab
- [ ] ✅ See tasks in table format
- [ ] Click "Status" filter
- [ ] Select "In Progress"
- [ ] ✅ Only in-progress tasks shown
- [ ] Click column header to sort
- [ ] ✅ Table sorts

---

## 👥 8. Invite Member (2 min)

- [ ] Click "Members" tab
- [ ] Enter email of another user
- [ ] Click "Invite"
- [ ] ✅ Member added to list
- [ ] Change role to "Admin"
- [ ] ✅ Role updated

---

## 🔔 9. Notifications (1 min)

- [ ] Look at bell icon in navbar
- [ ] ✅ See unread count badge
- [ ] Click bell
- [ ] ✅ Dropdown opens with notifications
- [ ] Click "Mark all as read"
- [ ] ✅ Badge disappears

---

## 🔍 10. Global Search (1 min)

- [ ] Click search input in navbar
- [ ] Type "test"
- [ ] ✅ Results dropdown appears
- [ ] ✅ See "Test Project" and "Test Task 1"
- [ ] Click on result
- [ ] ✅ Navigates to project/task

---

## ⚙️ 11. Project Settings (Admin) (1 min)

- [ ] Click "Settings" tab
- [ ] Change project name
- [ ] Click "Save"
- [ ] ✅ Name updated
- [ ] ✅ See "Archive" and "Delete" buttons

---

## 🚪 12. Sign Out (1 min)

- [ ] Click user avatar in navbar
- [ ] Click "Sign Out"
- [ ] ✅ Redirected to `/login`
- [ ] Try accessing `/dashboard`
- [ ] ✅ Redirected to `/login`

---

## 🎉 Test Complete!

### ✅ All Features Working?

If all checkboxes are checked, the application is working correctly!

### ❌ Found Issues?

Document them using this template:

```
**Issue**: [Brief description]
**Steps**: 
1. 
2. 
**Expected**: 
**Actual**: 
**Screenshot**: [If applicable]
```

---

## 🔄 Advanced Tests (Optional)

### Realtime Updates (2 min)
- [ ] Open app in 2 browser tabs
- [ ] In tab 1: drag a task
- [ ] In tab 2: ✅ Task moves within 2 seconds

### Member Permissions (3 min)
- [ ] Open app in incognito window
- [ ] Login as member (not admin)
- [ ] ✅ "New Task" button hidden
- [ ] Try to drag task not assigned to you
- [ ] ✅ Shows error
- [ ] Try to access `/projects/[id]/settings`
- [ ] ✅ Redirected with 403 error

### Responsive Design (2 min)
- [ ] Resize browser to mobile width
- [ ] ✅ Sidebar collapses
- [ ] ✅ Kanban scrolls horizontally
- [ ] ✅ Forms are full-width

---

## 📱 Mobile Testing (Optional)

### On Phone/Tablet
- [ ] Open `http://localhost:3000` on mobile
- [ ] ✅ Login works
- [ ] ✅ Dashboard loads
- [ ] ✅ Can create project
- [ ] ✅ Can create task
- [ ] ✅ Can drag task (touch)
- [ ] ✅ Can add comment

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: Check `.env.local` has correct Supabase URL and keys

### Issue: "404 on project pages"
**Solution**: Already fixed! All URLs use `/projects/[id]` not `/dashboard/projects/[id]`

### Issue: "Email not sending"
**Solution**: Add `RESEND_API_KEY` to `.env.local` (see `RESEND_SETUP.md`)

### Issue: "Drag & drop not working"
**Solution**: Make sure you're admin or dragging your own task

---

## 📊 Test Results

**Date**: _____________  
**Tester**: _____________  
**Browser**: _____________  
**Result**: ✅ Pass / ❌ Fail

**Notes**:
```
[Add any observations or issues here]
```

---

## 🚀 Ready for Production?

If all tests pass:
- ✅ Core features working
- ✅ RBAC enforced
- ✅ Realtime updates working
- ✅ No critical bugs

**Status**: READY TO DEPLOY 🎉

