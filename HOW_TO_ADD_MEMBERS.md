# 👥 How to Add Members to Your Project

## The Issue
You're only seeing yourself (Shubham Baisakh - admin) in the task assignee dropdown because **your project only has 1 member**.

This is NOT a bug - the code is working correctly! You just need to add more members.

---

## ✅ Solution: Add Members Through UI

### Step 1: Go to Members Tab

1. Open your project in the browser
2. Look for the **"Members"** tab in the project navigation
3. Click on it

**URL should be**: `http://localhost:3000/projects/[your-project-id]/members`

### Step 2: Invite Members

You'll see a form that says **"Invite Team Member"**

1. Enter an email address (e.g., `teammate@example.com`)
2. Click **"Invite Member"**
3. Done! ✅

**Important**: The person must have an account first!
- They need to sign up at: http://localhost:3000/signup
- Use their email to create an account
- Then you can add them to your project

---

## 🧪 Quick Test: Add Yourself with Another Email

To test immediately:

### Step 1: Create a Test Account

1. Open **Incognito/Private window**
2. Go to: http://localhost:3000/signup
3. Sign up with a different email:
   - Email: `test1@example.com`
   - Name: `Test User 1`
   - Password: `Test123!`
4. Complete signup

### Step 2: Add Test User to Project

1. Go back to your main browser window (logged in as Shubham)
2. Go to project → **Members** tab
3. Enter: `test1@example.com`
4. Click **"Invite Member"**
5. Should see: ✅ "Member invited successfully!"

### Step 3: Test Task Assignment

1. Go to project → **Board** or **List** view
2. Click **"New Task"**
3. Open **Assignee** dropdown
4. You should now see:
   - Unassigned
   - Shubham Baisakh (admin)
   - Test User 1 (member) ✅

---

## 🔄 Alternative: Add Multiple Test Users

Repeat the process to add more members:

1. Create `test2@example.com` → Add to project
2. Create `test3@example.com` → Add to project
3. Create `test4@example.com` → Add to project

Then your assignee dropdown will show all of them!

---

## 🗄️ Alternative: Add Directly in Database

If you want to skip the UI:

### Step 1: Create Test Users

Sign up with multiple emails first (as shown above)

### Step 2: Get IDs

In Supabase SQL Editor, run:

```sql
-- Get your project ID
SELECT id, name FROM projects ORDER BY created_at DESC;

-- Get all user IDs
SELECT id, full_name, email FROM profiles ORDER BY created_at DESC;
```

### Step 3: Add Members

```sql
-- Replace with actual IDs from above
INSERT INTO project_members (project_id, user_id, role)
VALUES 
  ('your-project-id', 'test-user-1-id', 'member'),
  ('your-project-id', 'test-user-2-id', 'member'),
  ('your-project-id', 'test-user-3-id', 'member');
```

---

## ✅ Verify It Worked

### In Browser:

1. Hard refresh: **Ctrl+Shift+R**
2. Go to project → Members tab
3. Should see multiple members listed
4. Go to create task
5. Assignee dropdown should show all members

### In Console (F12):

```
Fetching members for project: abc-123
Members data: [{...}, {...}, {...}]
Setting members: 3 members found  ← Should be > 1
```

---

## 📊 Check Current Member Count

To see how many members are currently in your project:

1. Go to Supabase: https://supabase.com/dashboard/project/aeedlewstzxreztohtpl
2. Go to **SQL Editor**
3. Run:

```sql
SELECT 
  p.name as project_name,
  COUNT(pm.user_id) as member_count,
  STRING_AGG(pr.full_name, ', ') as members
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
LEFT JOIN profiles pr ON pm.user_id = pr.id
GROUP BY p.id, p.name;
```

If `member_count = 1`, that's why you only see 1 member!

---

## 🎯 Summary

**The code is working perfectly!** ✅

Your project simply has only 1 member (you). To see more members in the assignee dropdown:

1. **Create test accounts** (or invite real teammates)
2. **Add them to your project** via Members tab
3. **Refresh and test** - they'll appear in assignee dropdown

That's it! Once you add members, they'll automatically show up everywhere they should.

