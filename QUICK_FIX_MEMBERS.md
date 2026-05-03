# ⚡ Quick Fix: Members Not Showing

## The Issue
Only seeing 1 member (yourself) in task assignee dropdown.

## The Fix (2 Minutes)

### 🔴 Step 1: Fix Database (MOST IMPORTANT!)

1. Go to: https://supabase.com/dashboard/project/aeedlewstzxreztohtpl
2. Click **"SQL Editor"** → **"New Query"**
3. Copy from: `taskmanager/supabase/migrations/20260503000001_fix_rls_policies.sql`
4. Paste and click **"Run"**
5. Should see: ✅ "Success. No rows returned"

**This fixes the infinite recursion error blocking member fetching.**

---

### 📊 Step 2: Check How Many Members Exist

In Supabase SQL Editor, run:

```sql
SELECT 
  p.name as project_name,
  COUNT(pm.user_id) as member_count
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.id, p.name
ORDER BY p.created_at DESC;
```

**Results:**
- `member_count = 1` → Only you in project (add more members)
- `member_count > 1` → Multiple members exist (should show now)

---

### 👥 Step 3: Add Members (If Needed)

If only 1 member exists:

1. Go to project page
2. Click **"Members"** tab
3. Click **"Invite Member"**
4. Enter email and add

---

### ✅ Step 4: Test

1. Press **Ctrl+Shift+R** (hard refresh)
2. Go to project
3. Click **"New Task"**
4. Check assignee dropdown
5. Should see all members! 🎉

---

## Why This Happens

The database has broken RLS policies causing infinite recursion. This blocks:
- ❌ Member fetching
- ❌ Project creation
- ❌ Notifications

**The SQL fix repairs these policies.**

---

## Verify It's Working

Open browser console (F12) and look for:

```
Fetching members for project: abc-123
Members data: [{...}, {...}, {...}]
Setting members: 3 members found
```

If you see errors or only 1 member, the SQL fix wasn't applied.

---

## Files

- **SQL Fix**: `supabase/migrations/20260503000001_fix_rls_policies.sql`
- **Detailed Guide**: `MEMBER_ISSUE_SOLUTION.md`
- **Debug Guide**: `MEMBER_FETCHING_DEBUG.md`
- **Check Members**: `CHECK_MEMBERS.sql`

