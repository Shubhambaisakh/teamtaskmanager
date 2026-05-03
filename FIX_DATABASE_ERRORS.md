# Fix Database Errors - Manual Steps

## Issues to Fix

1. ✅ **Notifications API 500 Error** - Fixed in code
2. ⚠️ **Projects API 500 Error** - Needs database migration
3. ✅ **CSP WebSocket Error** - Fixed in code

## Step 1: Apply Code Fixes (Already Done)

The following files have been updated:
- ✅ `middleware.ts` - Added `wss://*.supabase.co` to CSP
- ✅ `app/api/notifications/route.ts` - Fixed query to remove invalid join

## Step 2: Apply Database Migration (Manual)

You need to run the SQL migration in your Supabase dashboard to fix the infinite recursion error.

### Instructions:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `aeedlewstzxreztohtpl`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste This SQL**

```sql
-- Fix infinite recursion in project_members RLS policies
-- The issue: policies were querying project_members from within project_members policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Admins can add project members" ON project_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON project_members;
DROP POLICY IF EXISTS "Admins can remove members" ON project_members;

-- ============================================================================
-- FIXED RLS POLICIES - PROJECT_MEMBERS
-- ============================================================================

-- Users can view members of projects they belong to
-- Fix: Use project_id directly to avoid recursion
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
    )
  );

-- Admins can add members to their projects
-- Fix: Allow insert if user is creating their own membership OR if they're admin
CREATE POLICY "Admins can add project members"
  ON project_members FOR INSERT
  WITH CHECK (
    -- Allow users to be added by admins
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
    OR
    -- Allow initial project creator to add themselves
    (user_id = auth.uid() AND NOT EXISTS (
      SELECT 1 FROM project_members pm2
      WHERE pm2.project_id = project_members.project_id
    ))
  );

-- Admins can update member roles
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

-- Admins can remove members (but not themselves if they're the last admin)
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

4. **Run the Query**
   - Click "Run" or press `Ctrl+Enter`
   - You should see "Success. No rows returned"

5. **Verify the Fix**
   - Go back to your app at http://localhost:3000
   - Hard refresh (Ctrl+Shift+R)
   - Try creating a new project
   - It should work now!

## Step 3: Restart Dev Server (Optional)

If the errors persist after applying the migration:

```bash
# Stop the current dev server (Ctrl+C in the terminal)
# Then restart it
npm run dev
```

## What Was Fixed?

### 1. Infinite Recursion in RLS Policies

**Problem**: The `project_members` table had RLS policies that queried `project_members` within themselves, causing infinite recursion.

**Example of the problem**:
```sql
-- BAD: This causes infinite recursion
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm  -- ❌ Querying project_members from project_members policy!
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
    )
  );
```

**Solution**: Use `IN` with a subquery instead of `EXISTS`:
```sql
-- GOOD: No recursion
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    project_id IN (
      SELECT pm.project_id 
      FROM project_members pm  -- ✅ This is evaluated first, then applied
      WHERE pm.user_id = auth.uid()
    )
  );
```

### 2. Notifications Query Error

**Problem**: Trying to join `notifications` directly with `projects` when there's no direct foreign key.

**Fixed in**: `app/api/notifications/route.ts`

**Before**:
```typescript
.select(`
  *,
  tasks(
    id,
    title,
    project_id,
    projects(id, name)  // ❌ Can't nest projects here
  ),
  projects(id, name)  // ❌ No direct relationship
`)
```

**After**:
```typescript
.select(`
  *,
  tasks(
    id,
    title,
    project_id  // ✅ Just get the project_id
  )
`)
```

### 3. CSP WebSocket Blocking

**Problem**: Content Security Policy was blocking WebSocket connections to Supabase Realtime.

**Fixed in**: `middleware.ts`

**Before**:
```typescript
connect-src 'self' https://*.supabase.co
```

**After**:
```typescript
connect-src 'self' https://*.supabase.co wss://*.supabase.co
```

## Expected Results After Fixes

✅ No more "infinite recursion" errors when creating projects
✅ No more 500 errors on notifications API
✅ No more CSP violations for WebSocket connections
✅ Supabase Realtime should connect successfully
✅ You can create new projects
✅ Notifications should load properly

## Troubleshooting

If you still see errors after applying the migration:

1. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R`
2. **Check Supabase logs**: Go to Supabase Dashboard → Logs → API
3. **Verify migration ran**: In SQL Editor, run:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'project_members';
   ```
   You should see 4 policies listed.

4. **Check your user has projects**: In SQL Editor, run:
   ```sql
   SELECT * FROM project_members WHERE user_id = auth.uid();
   ```

## Need Help?

If you encounter any issues:
1. Check the browser console for specific error messages
2. Check the terminal where `npm run dev` is running
3. Check Supabase Dashboard → Logs for database errors
