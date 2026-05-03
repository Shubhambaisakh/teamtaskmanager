-- ============================================================================
-- COMPLETE RLS FIX - Removes ALL infinite recursion issues
-- ============================================================================
-- This fixes the circular dependency between project_members and other tables
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Admins can add project members" ON project_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON project_members;
DROP POLICY IF EXISTS "Admins can remove members" ON project_members;

-- Step 2: Create a SECURITY DEFINER function to check project membership
-- This function runs with elevated privileges and breaks the recursion cycle
CREATE OR REPLACE FUNCTION is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM project_members 
    WHERE project_id = project_uuid 
    AND user_id = user_uuid
  );
$$;

CREATE OR REPLACE FUNCTION is_project_admin(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM project_members 
    WHERE project_id = project_uuid 
    AND user_id = user_uuid
    AND role = 'admin'
  );
$$;

-- Step 3: Recreate project_members policies using the helper functions
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Admins can add project members"
  ON project_members FOR INSERT
  WITH CHECK (
    is_project_admin(project_id, auth.uid())
    OR
    -- Allow initial project creator to add themselves
    (user_id = auth.uid() AND NOT EXISTS (
      SELECT 1 FROM project_members pm2
      WHERE pm2.project_id = project_members.project_id
    ))
  );

CREATE POLICY "Admins can update member roles"
  ON project_members FOR UPDATE
  USING (is_project_admin(project_id, auth.uid()));

CREATE POLICY "Admins can remove members"
  ON project_members FOR DELETE
  USING (is_project_admin(project_id, auth.uid()));

-- Step 4: Update projects policies to use helper functions
DROP POLICY IF EXISTS "Users can view member projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

CREATE POLICY "Users can view member projects"
  ON projects FOR SELECT
  USING (is_project_member(id, auth.uid()));

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (is_project_admin(id, auth.uid()));

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (is_project_admin(id, auth.uid()));

-- Step 5: Update tasks policies to use helper functions
DROP POLICY IF EXISTS "Users can view project tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can create tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can update all tasks" ON tasks;
DROP POLICY IF EXISTS "Members can update assigned task status" ON tasks;
DROP POLICY IF EXISTS "Admins can delete tasks" ON tasks;

CREATE POLICY "Users can view project tasks"
  ON tasks FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Admins can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (is_project_admin(project_id, auth.uid()));

CREATE POLICY "Admins can update all tasks"
  ON tasks FOR UPDATE
  USING (is_project_admin(project_id, auth.uid()));

CREATE POLICY "Members can update assigned task status"
  ON tasks FOR UPDATE
  USING (
    assignee_id = auth.uid()
    AND is_project_member(project_id, auth.uid())
  )
  WITH CHECK (
    assignee_id = auth.uid()
    AND is_project_member(project_id, auth.uid())
  );

CREATE POLICY "Admins can delete tasks"
  ON tasks FOR DELETE
  USING (is_project_admin(project_id, auth.uid()));

-- Step 6: Update comments policies
DROP POLICY IF EXISTS "Users can view comments on project tasks" ON comments;
DROP POLICY IF EXISTS "Users can create comments on project tasks" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

CREATE POLICY "Users can view comments on project tasks"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND is_project_member(tasks.project_id, auth.uid())
    )
  );

CREATE POLICY "Users can create comments on project tasks"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND is_project_member(tasks.project_id, auth.uid())
    )
  );

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (user_id = auth.uid());

-- Success message
SELECT 'RLS policies fixed successfully! All infinite recursion issues resolved.' AS status;
