# Push to Shubhambaisakh's Repository 🔐

## Current Situation
- **Target Repository**: `https://github.com/Shubhambaisakh/teamtaskmanager.git`
- **Your Account**: `manishahirrao`
- **Problem**: You don't have permission to push directly

## Solutions

### Option 1: Get Added as Collaborator (Recommended)

Ask `Shubhambaisakh` to add you as a collaborator:

#### Steps for Shubhambaisakh:
1. Go to: https://github.com/Shubhambaisakh/teamtaskmanager
2. Click **Settings** tab
3. Click **Collaborators** (left sidebar)
4. Click **Add people**
5. Search for: `manishahirrao`
6. Click **Add manishahirrao to this repository**

#### After Being Added:
You'll receive an email invitation. Accept it, then:

```powershell
cd D:\taskmanager\teamtaskmanager

# Clear cached credentials
git credential-manager-core erase

# Push (will ask for YOUR credentials)
git push -u origin main
```

When prompted:
- **Username**: `manishahirrao`
- **Password**: Your Personal Access Token

---

### Option 2: Use Shubhambaisakh's Credentials

If you have access to Shubhambaisakh's account:

#### Clear Current Credentials
```powershell
# Method 1: Command line
git credential-manager-core erase

# Method 2: Windows Credential Manager
# 1. Press Win + R
# 2. Type: control /name Microsoft.CredentialManager
# 3. Click "Windows Credentials"
# 4. Find "git:https://github.com" and remove it
```

#### Configure Git as Shubhambaisakh
```powershell
cd D:\taskmanager\teamtaskmanager

# Set local Git config (only for this project)
git config user.name "Shubhambaisakh"
git config user.email "shubham@example.com"  # Use actual email

# Verify
git config user.name
git config user.email
```

#### Push with Shubhambaisakh's Credentials
```powershell
git push -u origin main
```

When prompted:
- **Username**: `Shubhambaisakh`
- **Password**: Shubhambaisakh's Personal Access Token

---

### Option 3: Fork → Pull Request (Collaborative Workflow)

This is the standard way to contribute to someone else's repository:

#### Step 1: Fork the Repository
1. Go to: https://github.com/Shubhambaisakh/teamtaskmanager
2. Click **Fork** button (top right)
3. This creates: `https://github.com/manishahirrao/teamtaskmanager`

#### Step 2: Change Remote to Your Fork
```powershell
cd D:\taskmanager\teamtaskmanager

# Change remote to your fork
git remote set-url origin https://github.com/manishahirrao/teamtaskmanager.git

# Verify
git remote -v
```

#### Step 3: Push to Your Fork
```powershell
git push -u origin main
```

#### Step 4: Create Pull Request
1. Go to your fork: https://github.com/manishahirrao/teamtaskmanager
2. Click **Contribute** → **Open pull request**
3. Add description of your changes
4. Click **Create pull request**
5. Shubhambaisakh can review and merge your changes

---

## Quick Commands for Each Option

### Option 1: After Being Added as Collaborator
```powershell
cd D:\taskmanager\teamtaskmanager
git credential-manager-core erase
git push -u origin main
# Enter YOUR credentials (manishahirrao)
```

### Option 2: Using Shubhambaisakh's Account
```powershell
cd D:\taskmanager\teamtaskmanager
git config user.name "Shubhambaisakh"
git config user.email "shubham@example.com"
git credential-manager-core erase
git push -u origin main
# Enter SHUBHAM's credentials
```

### Option 3: Fork and Pull Request
```powershell
# First, fork on GitHub, then:
cd D:\taskmanager\teamtaskmanager
git remote set-url origin https://github.com/manishahirrao/teamtaskmanager.git
git push -u origin main
# Then create PR on GitHub
```

---

## How to Get Personal Access Token

If you need to create a token:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name: `TeamTaskManager`
4. Expiration: Choose duration
5. Select scopes: ✅ **repo** (full control)
6. Click **Generate token**
7. **COPY THE TOKEN** immediately (you won't see it again!)
8. Use this as password when pushing

---

## Recommended Approach

**Option 1** is best if:
- ✅ You're working together on the same project
- ✅ You need direct push access
- ✅ Shubhambaisakh trusts you with write access

**Option 3** is best if:
- ✅ You want to keep changes separate until reviewed
- ✅ Following standard open-source workflow
- ✅ Want to maintain clear change history

---

## Check Current Credentials

See what credentials are cached:

```powershell
# Check Git config
git config --list | Select-String "user"

# Check credential helper
git config --get credential.helper
```

---

## Clear All GitHub Credentials

If you keep getting 403 errors:

```powershell
# Remove all GitHub credentials
cmdkey /list | Select-String "github" | ForEach-Object { cmdkey /delete:($_ -replace ".*Target: ","") }

# Or manually:
# 1. Open Credential Manager (control /name Microsoft.CredentialManager)
# 2. Remove all "git:https://github.com" entries
```

---

## What I Recommend

**Contact Shubhambaisakh and ask:**

> "Hi Shubham, I've been working on the teamtaskmanager project and made some updates to the frontend. Can you add me (manishahirrao) as a collaborator to the repository so I can push my changes? Or should I create a pull request instead?"

Then follow **Option 1** or **Option 3** based on their response.

---

## Need Help?

Let me know which option you want to use and I'll guide you through it step by step!
