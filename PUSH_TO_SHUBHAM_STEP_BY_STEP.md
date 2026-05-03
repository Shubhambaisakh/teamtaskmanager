# Push to Shubham's GitHub - Step by Step Guide 🚀

## Current Situation
- **Your Account**: manishahirrao
- **Target Repository**: https://github.com/Shubhambaisakh/teamtaskmanager.git
- **Problem**: Permission denied (403 error)

---

## Solution: Use Shubham's Credentials

### Step 1: Clear Cached Credentials

Open PowerShell in your project directory and run:

```powershell
cd D:\taskmanager\teamtaskmanager

# Clear cached GitHub credentials
git credential-manager-core erase
```

**Alternative Method** (if above doesn't work):
1. Press `Win + R`
2. Type: `control /name Microsoft.CredentialManager`
3. Click "Windows Credentials"
4. Find any entries with "git:https://github.com"
5. Click each one and select "Remove"

---

### Step 2: Configure Git as Shubham (Local Only)

This changes Git config ONLY for this project:

```powershell
cd D:\taskmanager\teamtaskmanager

# Set Shubham's name and email for this project only
git config user.name "Shubhambaisakh"
git config user.email "shubham.baisakh@example.com"

# Verify it's set correctly
git config user.name
git config user.email
```

**Note**: Replace `shubham.baisakh@example.com` with Shubham's actual email

---

### Step 3: Get Shubham's Personal Access Token

Shubham needs to create a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `TeamTaskManager`
4. Expiration: Choose duration (30 days, 60 days, etc.)
5. Select scopes: ✅ **repo** (full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** immediately (it won't be shown again!)

Example token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 4: Push to GitHub

Now push using Shubham's credentials:

```powershell
cd D:\taskmanager\teamtaskmanager

# Push to GitHub
git push -u origin main
```

When prompted:
- **Username**: `Shubhambaisakh`
- **Password**: Paste the Personal Access Token (not the actual password!)

---

## Complete Command Sequence

Copy and paste these commands one by one:

```powershell
# Navigate to project
cd D:\taskmanager\teamtaskmanager

# Clear credentials
git credential-manager-core erase

# Configure as Shubham (local only)
git config user.name "Shubhambaisakh"
git config user.email "shubham@example.com"

# Verify configuration
git config user.name
git config user.email

# Check what will be pushed
git status

# Push to GitHub
git push -u origin main
```

---

## Troubleshooting

### Issue 1: Still Getting 403 Error

**Solution**: Credentials are still cached somewhere

```powershell
# Try this more aggressive credential clearing
cmdkey /list | Select-String "github" | ForEach-Object { 
    $target = ($_ -replace ".*Target: ","").Trim()
    cmdkey /delete:$target
}

# Then try pushing again
git push -u origin main
```

### Issue 2: "Authentication Failed"

**Causes**:
- Wrong username (must be `Shubhambaisakh`)
- Wrong token (must be valid Personal Access Token)
- Token expired
- Token doesn't have `repo` scope

**Solution**: 
1. Verify username is exactly `Shubhambaisakh`
2. Generate a new token with `repo` scope
3. Try again

### Issue 3: "Updates Were Rejected"

**Cause**: Remote has changes you don't have locally

**Solution**:
```powershell
# Pull first, then push
git pull origin main --rebase
git push -u origin main
```

---

## After Successful Push

Verify on GitHub:
1. Go to: https://github.com/Shubhambaisakh/teamtaskmanager
2. Check the latest commit
3. Verify your changes are there
4. Check the commit author (should show Shubhambaisakh)

---

## Important Notes

### Security
- ⚠️ **Never share** Personal Access Tokens
- ⚠️ **Never commit** tokens to the repository
- ⚠️ Store tokens securely (password manager)
- ⚠️ Revoke tokens when no longer needed

### Git Config
The `git config` commands above only affect THIS project. Your global Git config (for other projects) remains unchanged.

To check:
```powershell
# Local config (this project only)
git config user.name

# Global config (all projects)
git config --global user.name
```

---

## Alternative: Ask Shubham to Add You as Collaborator

If you'll be pushing frequently, it's better to be added as a collaborator:

### For Shubham:
1. Go to: https://github.com/Shubhambaisakh/teamtaskmanager/settings/access
2. Click **"Add people"**
3. Search for: `manishahirrao`
4. Click **"Add manishahirrao to this repository"**

### For You (after being added):
```powershell
# Clear credentials
git credential-manager-core erase

# Push with YOUR credentials
git push -u origin main

# Use YOUR username and token when prompted
```

This way you can use your own credentials!

---

## Quick Reference

### Clear Credentials
```powershell
git credential-manager-core erase
```

### Set Local Git Config
```powershell
git config user.name "Shubhambaisakh"
git config user.email "shubham@example.com"
```

### Push
```powershell
git push -u origin main
```

### Check Status
```powershell
git status
git remote -v
git config user.name
```

---

## What Happens When You Push

1. Git asks for credentials
2. You enter Shubham's username
3. You enter Shubham's Personal Access Token
4. Git validates with GitHub
5. Your code is pushed to the repository
6. Commit shows Shubham as author (because of git config)

---

## Need Help?

If you get stuck at any step, let me know:
- What command you ran
- What error message you got
- What step you're on

I'll help you troubleshoot!

---

**Ready to push?** Start with Step 1! 🚀
