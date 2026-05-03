-- Fix RLS recursion and project creation access
-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view member projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Admins can add project members" ON project_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON project_members;
DROP POLICY IF EXISTS "Admins can remove members" ON project_members;

-- Updated Project Policies
CREATE POLICY "Users can view member projects"
  ON projects FOR SELECT
  USING (is_project_member(id, auth.uid()));

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (is_project_admin(id, auth.uid()));

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (is_project_admin(id, auth.uid()));

-- Updated Project Members Policies
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Admins can add project members"
  ON project_members FOR INSERT
  WITH CHECK (is_project_admin(project_id, auth.uid()) OR (user_id = auth.uid()));

CREATE POLICY "Admins can update member roles"
  ON project_members FOR UPDATE
  USING (is_project_admin(project_id, auth.uid()));

CREATE POLICY "Admins can remove members"
  ON project_members FOR DELETE
  USING (is_project_admin(project_id, auth.uid()));
