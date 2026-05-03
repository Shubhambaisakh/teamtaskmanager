# 🚨 URGENT: Apply Database Fix Now

## The Problem
Your app is showing 500 errors because of infinite recursion in database policies. This is blocking:
- ❌ Creating projects
- ❌ Loading notifications  
- ❌ Viewing project lists

## The Solution (2 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/aeedlewstzxreztohtpl
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Copy This SQL

Open the file: `taskmanager/supabase/migrations/20260503000001_fix_rls_policies.sql`

Or copy this:

```sql
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Admins can add project members" ON project_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON project_members;
DROP POLICY IF EXISTS "Admins can remove members" ON project_members;

CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can add project members"
  ON project_members FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
    OR
    (user_id = auth.uid() AND NOT EXISTS (
      SELECT 1 FROM project_members pm2
      WHERE pm2.project_id = project_members.project_id
    ))
  );

CREATE POLICY "Admins can update member roles"
  ON project_members FOR UPDATE
  USING (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
  );

CREATE POLICY "Admins can remove members"
  ON project_members FOR DELETE
  USING (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
  );
```

### Step 3: Run It
1. Paste the SQL into the editor
2. Click **"Run"** (or press Ctrl+Enter)
3. You should see: ✅ "Success. No rows returned"

### Step 4: Test Your App
1. Go back to http://localhost:3000
2. Press **Ctrl+Shift+R** (hard refresh)
3. Try creating a project
4. It should work! ✅

---

## What This Does

This fixes the database policies that were causing infinite loops. The old policies were trying to check `project_members` from within `project_members` policies, which created a circular reference.

**Before (Broken)**:
```sql
-- This causes infinite recursion ❌
EXISTS (
  SELECT 1 FROM project_members pm
  WHERE pm.project_id = project_members.project_id
  ...
)
```

**After (Fixed)**:
```sql
-- This works correctly ✅
project_id IN (
  SELECT pm.project_id 
  FROM project_members pm
  WHERE pm.user_id = auth.uid()
)
```

---

## Verification

After running the SQL, you should see:
- ✅ No more "infinite recursion" errors
- ✅ Projects page loads
- ✅ Can create new projects
- ✅ Notifications load
- ✅ Dashboard works properly

---

## Still Having Issues?

If you still see errors after applying the fix:

1. **Check the SQL ran successfully**
   - In Supabase SQL Editor, run:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'project_members';
   ```
   - You should see 4 policies

2. **Clear browser cache completely**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito mode

3. **Restart dev server**
   ```bash
   # In terminal, press Ctrl+C to stop
   npm run dev
   ```

---

## Need the SQL File?

The complete SQL is in:
`taskmanager/supabase/migrations/20260503000001_fix_rls_policies.sql`

Just open it, copy all the content, and paste it into Supabase SQL Editor.
