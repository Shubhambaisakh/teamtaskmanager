-- 🔍 Check Project Members
-- Run this in Supabase SQL Editor to see all members in your projects

-- 1. See all your projects
SELECT 
  p.id,
  p.name,
  p.description,
  COUNT(pm.user_id) as member_count
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.id, p.name, p.description
ORDER BY p.created_at DESC;

-- 2. See all members in a specific project (replace 'your-project-id' with actual ID)
-- Get project ID from the query above, then uncomment and run:
/*
SELECT 
  pm.id,
  pm.role,
  pm.joined_at,
  pr.full_name,
  pr.email,
  pr.avatar_url
FROM project_members pm
JOIN profiles pr ON pm.user_id = pr.id
WHERE pm.project_id = 'your-project-id'
ORDER BY pm.joined_at;
*/

-- 3. See all members across ALL projects
SELECT 
  p.name as project_name,
  pm.role,
  pr.full_name,
  pr.email,
  pm.joined_at
FROM project_members pm
JOIN projects p ON pm.project_id = p.id
JOIN profiles pr ON pm.user_id = pr.id
ORDER BY p.name, pm.joined_at;

-- 4. Check if RLS policies are working (should return rows if you're a member)
SELECT 
  pm.*,
  pr.full_name
FROM project_members pm
JOIN profiles pr ON pm.user_id = pr.id
WHERE pm.user_id = auth.uid();
