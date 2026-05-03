# 🚀 Add Members Now - 2 Minutes

## Why You Only See 1 Member

**Your project only has 1 member (you).** That's why only "Shubham Baisakh (admin)" shows in the dropdown.

The code is working! You just need to add more members.

---

## Quick Fix: Add Test Members

### Method 1: Through UI (Easiest)

**Step 1: Create a test account**
1. Open **Incognito window**
2. Go to: http://localhost:3000/signup
3. Sign up:
   - Email: `test1@example.com`
   - Name: `Test User 1`
   - Password: `Test123!`

**Step 2: Add to your project**
1. Back in your main window (logged in as Shubham)
2. Go to your project
3. Click **"Members"** tab
4. Enter: `test1@example.com`
5. Click **"Invite Member"**

**Step 3: Test it**
1. Press **Ctrl+Shift+R** (refresh)
2. Click **"New Task"**
3. Open Assignee dropdown
4. You'll see both members! ✅

---

### Method 2: Add in Database (Faster)

**Step 1: Create test users first** (sign up with different emails)

**Step 2: Run this in Supabase SQL Editor:**

```sql
-- Get your project ID and user IDs
SELECT 'PROJECT:', id, name FROM projects ORDER BY created_at DESC LIMIT 3;
SELECT 'USERS:', id, full_name, email FROM profiles ORDER BY created_at DESC;

-- Then add members (replace IDs)
INSERT INTO project_members (project_id, user_id, role)
VALUES ('YOUR_PROJECT_ID', 'USER_ID_HERE', 'member');
```

---

## Where is the Members Tab?

When viewing a project, look for tabs like:
- Board
- List
- **Members** ← Click this
- Settings

Or go directly to:
`http://localhost:3000/projects/[your-project-id]/members`

---

## Verify It Worked

After adding members:

1. **Refresh**: Ctrl+Shift+R
2. **Check Members tab**: Should show multiple members
3. **Create Task**: Assignee dropdown should show all members
4. **Console (F12)**: Should show "Setting members: X members found" (X > 1)

---

## Summary

✅ **Code is working**
⚠️ **Project has only 1 member**
🎯 **Solution**: Add more members (2 minutes)

Once you add members, they'll show in the assignee dropdown automatically!

