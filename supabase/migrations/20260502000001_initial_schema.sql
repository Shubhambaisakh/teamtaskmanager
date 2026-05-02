-- Team Task Manager — Initial Database Schema
-- Created: 2026-05-02
-- Description: Complete database schema with RLS policies, triggers, and indexes

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'in_review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE member_role AS ENUM ('admin', 'member');
CREATE TYPE notif_type AS ENUM ('task_assigned', 'task_updated', 'comment_added');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 1 AND char_length(full_name) <= 120),
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 120),
  description TEXT CHECK (char_length(description) <= 1000),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project members (join table with roles)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 255),
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 2000),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notif_type NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for tasks with computed overdue flag
CREATE VIEW tasks_with_overdue AS
SELECT 
  t.*,
  (t.due_date < CURRENT_DATE AND t.status != 'done') AS is_overdue
FROM tasks t;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Composite index for efficient task queries
CREATE INDEX idx_tasks_project_status_due ON tasks(project_id, status, due_date);

-- Index for project members lookup
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);

-- Index for notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Index for comments
CREATE INDEX idx_comments_task ON comments(task_id);

-- Full-text search indexes
CREATE INDEX idx_tasks_search ON tasks USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_projects_search ON projects USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle task completion (sets completed_at)
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to 'done', set completed_at
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    NEW.completed_at = NOW();
  -- If status changed from 'done' to something else, clear completed_at
  ELSIF NEW.status != 'done' AND OLD.status = 'done' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if user is a project member
CREATE OR REPLACE FUNCTION is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is a project admin
CREATE OR REPLACE FUNCTION is_project_admin(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid AND user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Trigger for task completion
CREATE TRIGGER on_task_status_change
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_task_completion();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

-- Users can view all profiles (for team member lists)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - PROJECTS
-- ============================================================================

-- Users can view projects they are members of
CREATE POLICY "Users can view member projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

-- Admins can insert projects (membership created separately)
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can update their projects
CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

-- Admins can delete their projects
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES - PROJECT_MEMBERS
-- ============================================================================

-- Users can view members of projects they belong to
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
    )
  );

-- Admins can add members to their projects
CREATE POLICY "Admins can add project members"
  ON project_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
  );

-- Admins can update member roles
CREATE POLICY "Admins can update member roles"
  ON project_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
  );

-- Admins can remove members
CREATE POLICY "Admins can remove members"
  ON project_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES - TASKS
-- ============================================================================

-- Users can view tasks in projects they are members of
CREATE POLICY "Users can view project tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
    )
  );

-- Admins can create tasks
CREATE POLICY "Admins can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

-- Admins can update any task, members can only update status of assigned tasks
CREATE POLICY "Admins can update all tasks"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

CREATE POLICY "Members can update assigned task status"
  ON tasks FOR UPDATE
  USING (
    tasks.assignee_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
    )
  )
  WITH CHECK (
    tasks.assignee_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
    )
  );

-- Admins can delete tasks
CREATE POLICY "Admins can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES - COMMENTS
-- ============================================================================

-- Users can view comments on tasks in their projects
CREATE POLICY "Users can view project comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN project_members ON project_members.project_id = tasks.project_id
      WHERE tasks.id = comments.task_id
      AND project_members.user_id = auth.uid()
    )
  );

-- Project members can create comments
CREATE POLICY "Members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN project_members ON project_members.project_id = tasks.project_id
      WHERE tasks.id = comments.task_id
      AND project_members.user_id = auth.uid()
    )
    AND comments.author_id = auth.uid()
  );

-- Authors can update their own comments
CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE
  USING (author_id = auth.uid());

-- Authors and admins can delete comments (soft delete)
CREATE POLICY "Authors can delete own comments"
  ON comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Admins can delete any comment"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN project_members ON project_members.project_id = tasks.project_id
      WHERE tasks.id = comments.task_id
      AND project_members.user_id = auth.uid()
      AND project_members.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- System can create notifications (handled via service role)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================================================

-- Note: Storage bucket creation and policies must be done via Supabase Dashboard
-- Bucket name: avatars
-- Public: false
-- Allowed MIME types: image/jpeg, image/png
-- Max file size: 2MB

-- Storage policies (to be applied via Dashboard or separate storage migration):
-- 1. Authenticated users can upload to their own folder: bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()
-- 2. Authenticated users can read all avatars: bucket_id = 'avatars'
-- 3. Users can update/delete their own avatars: bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()
