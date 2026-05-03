# Quick Fix - Change Git Remote 🚀

## Your Current Setup
- **Git User**: Manish (manishkishor2003@gmail.com)
- **GitHub Username**: manishahirrao
- **Current Remote**: Shubhambaisakh/teamtaskmanager ❌
- **Problem**: You don't have permission to push to someone else's repo

## Quick Fix Steps

### Step 1: Create New Repository on GitHub

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `teamtaskmanager`
   - **Description**: Team Task Manager - Next.js + Supabase
   - **Visibility**: Public (or Private if you prefer)
   - **DO NOT** check any boxes (no README, no .gitignore, no license)
3. Click **"Create repository"**

### Step 2: Copy These Commands

After creating the repository, run these commands in PowerShell:

```powershell
# Navigate to your project
cd D:\taskmanager\teamtaskmanager

# Remove the old remote
git remote remove origin

# Add YOUR new remote
git remote add origin https://github.com/manishahirrao/teamtaskmanager.git

# Verify it's correct
git remote -v

# Push your code
git push -u origin main
```

### Step 3: Enter Credentials When Prompted

When you push, Git will ask for credentials:
- **Username**: `manishahirrao`
- **Password**: Use a **Personal Access Token** (not your GitHub password)

#### How to Get Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "TeamTaskManager"
4. Select scopes: Check **`repo`** (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## Alternative: Use GitHub CLI (Easier)

If you have GitHub CLI installed:

```powershell
# Login to GitHub
gh auth login

# Follow the prompts to authenticate

# Then push
git push -u origin main
```

---

## One-Line Fix (After Creating Repo)

```powershell
cd D:\taskmanager\teamtaskmanager; git remote remove origin; git remote add origin https://github.com/manishahirrao/teamtaskmanager.git; git remote -v; git push -u origin main
```

---

## Verify Success

After pushing, check:
1. Go to: https://github.com/manishahirrao/teamtaskmanager
2. You should see all your files
3. Check the commit history
4. Verify the "final" commit is there

---

## What If You Get 403 Error Again?

This means credentials are cached. Clear them:

### Option 1: Windows Credential Manager
```powershell
# Open Credential Manager
control /name Microsoft.CredentialManager

# Find "git:https://github.com" and remove it
```

### Option 2: Command Line
```powershell
# Clear Git credentials
git credential-manager-core erase
```

Then try pushing again.

---

## Summary

1. ✅ Create repo: https://github.com/new
2. ✅ Name it: `teamtaskmanager`
3. ✅ Run: `git remote remove origin`
4. ✅ Run: `git remote add origin https://github.com/manishahirrao/teamtaskmanager.git`
5. ✅ Run: `git push -u origin main`
6. ✅ Enter your GitHub username and Personal Access Token

Done! 🎉
