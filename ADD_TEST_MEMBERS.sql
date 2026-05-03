-- ============================================================================
-- CHECK AND ADD TEST MEMBERS
-- ============================================================================
-- Run this in Supabase SQL Editor to check and add members

-- STEP 1: Check how many members are in your projects
SELECT 
  p.id as project_id,
  p.name as project_name,
  COUNT(pm.user_id) as member_count,
  STRING_AGG(pr.full_name, ', ') as members
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
LEFT JOIN profiles pr ON pm.user_id = pr.id
GROUP BY p.id, p.name
ORDER BY p.created_at DESC;

-- ============================================================================
-- If you see member_count = 1, that's why only 1 member shows!
-- ============================================================================

-- STEP 2: Check all users in your system
SELECT 
  id,
  full_name,
  email,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================================================
-- STEP 3: Add members to a project (if you have multiple users)
-- ============================================================================
-- First, get your project ID from STEP 1 above
-- Then, get user IDs from STEP 2 above
-- Replace 'YOUR_PROJECT_ID' and 'USER_ID_TO_ADD' with actual values

/*
-- Example: Add a user to a project
INSERT INTO project_members (project_id, user_id, role)
VALUES ('YOUR_PROJECT_ID', 'USER_ID_TO_ADD', 'member');
*/

-- ============================================================================
-- STEP 4: If you don't have other users, create test users first
-- ============================================================================
-- You need to sign up with different emails to create test users
-- Then come back and run STEP 2 to get their IDs
-- Then run STEP 3 to add them to your project

-- ============================================================================
-- STEP 5: Verify members were added
-- ============================================================================
-- Replace 'YOUR_PROJECT_ID' with your actual project ID

/*
SELECT 
  pm.id,
  pm.role,
  pr.full_name,
  pr.email,
  pm.joined_at
FROM project_members pm
JOIN profiles pr ON pm.user_id = pr.id
WHERE pm.project_id = 'YOUR_PROJECT_ID'
ORDER BY pm.joined_at;
*/
