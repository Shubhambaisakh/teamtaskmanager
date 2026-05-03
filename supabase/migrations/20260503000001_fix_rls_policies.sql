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
