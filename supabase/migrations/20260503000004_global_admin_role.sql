-- Add global role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role member_role NOT NULL DEFAULT 'member';

-- Create function to check if current user is global admin
CREATE OR REPLACE FUNCTION is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to give global admin full access
-- PROFILES
CREATE POLICY "Global Admins can manage all profiles"
  ON profiles FOR ALL
  USING (is_global_admin());

-- PROJECTS
CREATE POLICY "Global Admins can manage all projects"
  ON projects FOR ALL
  USING (is_global_admin());

-- PROJECT_MEMBERS
CREATE POLICY "Global Admins can manage all project members"
  ON project_members FOR ALL
  USING (is_global_admin());

-- TASKS
CREATE POLICY "Global Admins can manage all tasks"
  ON tasks FOR ALL
  USING (is_global_admin());

-- COMMENTS
CREATE POLICY "Global Admins can manage all comments"
  ON comments FOR ALL
  USING (is_global_admin());

-- NOTIFICATIONS
CREATE POLICY "Global Admins can manage all notifications"
  ON notifications FOR ALL
  USING (is_global_admin());

-- Restrict project creation to only global admins
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
CREATE POLICY "Only global admins can create projects"
  ON projects FOR INSERT
  WITH CHECK (is_global_admin());
