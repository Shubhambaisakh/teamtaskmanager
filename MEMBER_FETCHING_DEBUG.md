# 🔍 Member Fetching Debug Guide

## Current Status
You're seeing only one member (Shubham Baisakh - admin) in the assignee dropdown when creating tasks.

## Why This Happens

There are 3 possible reasons:

### 1. ⚠️ Database RLS Policies Not Fixed (MOST LIKELY)
The infinite recursion error in `project_members` table policies is blocking proper data fetching.

**Solution**: Apply the SQL fix in Supabase Dashboard

### 2. 📊 Project Only Has One Member
The project might actually only have you as a member.

**Solution**: Add more members to the project

### 3. 🐛 Query Issue
The Supabase query might not be working correctly.

**Solution**: Check browser console logs

---

## Step-by-Step Debugging

### Step 1: Check Browser Console (IMPORTANT!)

1. Open your app: http://localhost:3000
2. Press **F12** to open Developer Tools
3. Click on **Console** tab
4. Navigate to a project
5. Click **"New Task"** button
6. Look for these logs:

```
Fetching members for project: <project-id>
Members data: [...]
Members error: null
Setting members: X members found
```

**What to look for:**
- ✅ If you see `Members data: [...]` with an array → Query is working
- ❌ If you see `Members error: {...}` → There's a database error
- ⚠️ If you see `Setting members: 1 members found` → Only 1 member exists

### Step 2: Apply Database Fix (If Not Done Already)

**This is the most important step!**

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/aeedlewstzxreztohtpl
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**
4. Copy the SQL from: `taskmanager/supabase/migrations/20260503000001_fix_rls_policies.sql`
5. Paste and click **"Run"**
6. You should see: ✅ "Success. No rows returned"

**Why this matters:**
- Without this fix, the database policies have infinite recursion
- This blocks proper member fetching
- You'll only see yourself as a member

### Step 3: Verify Database Has Members

After applying the SQL fix, check if your project has multiple members:

1. In Supabase Dashboard, go to **"Table Editor"**
2. Click on **"project_members"** table
3. Look for rows with your project_id
4. You should see entries like:

| id | project_id | user_id | role | created_at |
|----|------------|---------|------|------------|
| 1  | abc-123    | user-1  | admin | ... |
| 2  | abc-123    | user-2  | member | ... |
| 3  | abc-123    | user-3  | member | ... |

**If you only see 1 row:**
- That's why you only see 1 member!
- You need to add more members to the project

### Step 4: Add Test Members (If Needed)

If your project only has you as a member, add more members:

1. Go to your project page
2. Click on **"Members"** tab
3. Click **"Invite Member"**
4. Enter email addresses of team members
5. They'll receive invitations

**OR** add test members directly in database:

```sql
-- In Supabase SQL Editor
INSERT INTO project_members (project_id, user_id, role)
VALUES 
  ('your-project-id', 'another-user-id', 'member');
```

### Step 5: Test Again

1. Hard refresh your browser: **Ctrl+Shift+R**
2. Navigate to project
3. Click **"New Task"**
4. Check the Assignee dropdown
5. You should now see all members!

---

## Expected Console Output (Working Correctly)

When everything works, you should see:

```
Fetching members for project: abc-123-def-456
Members data: [
  {
    user_id: "user-1",
    role: "admin",
    profiles: {
      id: "user-1",
      full_name: "Shubham Baisakh",
      email: "shubham@example.com",
      avatar_url: null
    }
  },
  {
    user_id: "user-2",
    role: "member",
    profiles: {
      id: "user-2",
      full_name: "Team Member 1",
      email: "member1@example.com",
      avatar_url: null
    }
  },
  {
    user_id: "user-3",
    role: "member",
    profiles: {
      id: "user-3",
      full_name: "Team Member 2",
      email: "member2@example.com",
      avatar_url: null
    }
  }
]
Members error: null
Setting members: 3 members found
```

---

## Common Errors and Solutions

### Error: "infinite recursion detected in policy"
**Cause**: RLS policies not fixed
**Solution**: Apply SQL fix from Step 2

### Error: "permission denied for table project_members"
**Cause**: RLS policies blocking access
**Solution**: Apply SQL fix from Step 2

### No error, but only 1 member shows
**Cause**: Project actually only has 1 member
**Solution**: Add more members (Step 4)

### Error: "Failed to load project members"
**Cause**: Network or authentication issue
**Solution**: 
1. Check if you're logged in
2. Check network tab in DevTools
3. Verify Supabase connection

---

## Quick Checklist

- [ ] Applied SQL fix in Supabase Dashboard
- [ ] Checked browser console for logs
- [ ] Verified project has multiple members in database
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tested creating a task
- [ ] Can see all members in assignee dropdown

---

## What's Next?

Once you complete these steps:

1. **If you see multiple members** → ✅ Everything is working!
2. **If you still see only 1 member** → Share the console logs with me
3. **If you see errors** → Share the error message with me

---

## Files Reference

- SQL Fix: `taskmanager/supabase/migrations/20260503000001_fix_rls_policies.sql`
- Simpler Guide: `taskmanager/APPLY_FIX_NOW.md`
- Component: `taskmanager/components/tasks/CreateTaskDialog.tsx`

