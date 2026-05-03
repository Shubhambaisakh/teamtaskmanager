-- Add deadline column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deadline DATE;

-- Add index for deadline queries
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);

-- Add comment
COMMENT ON COLUMN projects.deadline IS 'Project deadline date';
