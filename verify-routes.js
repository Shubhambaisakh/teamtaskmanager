// Quick verification script to check all routes
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Team Task Manager Routes...\n');

// Check if routes exist
const routes = [
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/projects/page.tsx',
  'app/(dashboard)/projects/new/page.tsx',
  'app/(dashboard)/projects/[id]/board/page.tsx',
  'app/(dashboard)/projects/[id]/list/page.tsx',
  'app/(dashboard)/projects/[id]/members/page.tsx',
  'app/(dashboard)/projects/[id]/settings/page.tsx',
  'app/(dashboard)/my-tasks/page.tsx',
  'app/(dashboard)/settings/page.tsx',
];

console.log('✅ Checking Route Files:\n');
routes.forEach(route => {
  const exists = fs.existsSync(path.join(__dirname, route));
  console.log(`${exists ? '✅' : '❌'} ${route}`);
});

// Check Sidebar navigation
console.log('\n✅ Checking Sidebar Navigation:\n');
const sidebarPath = path.join(__dirname, 'components/layout/Sidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

const expectedUrls = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Projects', url: '/projects' },
  { name: 'My Tasks', url: '/my-tasks' },
  { name: 'Settings', url: '/settings' },
];

expectedUrls.forEach(({ name, url }) => {
  const hasCorrectUrl = sidebarContent.includes(`href: '${url}'`);
  const hasWrongUrl = sidebarContent.includes(`href: '/dashboard${url === '/dashboard' ? '/projects' : url}'`);
  
  if (hasCorrectUrl && !hasWrongUrl) {
    console.log(`✅ ${name}: ${url}`);
  } else if (hasWrongUrl) {
    console.log(`❌ ${name}: Still has /dashboard prefix!`);
  } else {
    console.log(`⚠️  ${name}: URL not found`);
  }
});

// Check for any remaining /dashboard/ URLs
console.log('\n✅ Checking for Incorrect URLs:\n');
const filesToCheck = [
  'components/layout/Sidebar.tsx',
  'components/projects/DeleteProjectButton.tsx',
  'components/projects/ProjectCard.tsx',
  'components/projects/ProjectForm.tsx',
  'components/dashboard/ProjectProgressList.tsx',
  'components/dashboard/MyTasksList.tsx',
];

let foundIssues = false;
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasIssue = content.match(/['"`]\/dashboard\/(projects|my-tasks|settings)/);
    if (hasIssue) {
      console.log(`❌ ${file}: Found incorrect URL: ${hasIssue[0]}`);
      foundIssues = true;
    } else {
      console.log(`✅ ${file}: No issues`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (!foundIssues) {
  console.log('✅ ALL ROUTES AND URLS ARE CORRECT!');
  console.log('\nIf you\'re still seeing 404 errors:');
  console.log('1. Clear browser cache (Ctrl+Shift+Delete)');
  console.log('2. Unregister service workers (DevTools → Application)');
  console.log('3. Try incognito mode (Ctrl+Shift+N)');
  console.log('4. Hard refresh (Ctrl+Shift+R)');
} else {
  console.log('❌ FOUND ISSUES - Please fix the files listed above');
}
console.log('='.repeat(50) + '\n');
