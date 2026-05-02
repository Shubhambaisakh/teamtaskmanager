# Team Task Manager - Complete Setup Guide

This guide will walk you through setting up the Team Task Manager from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Google OAuth Setup](#google-oauth-setup)
5. [Database Migration](#database-migration)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 18 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: Comes with Node.js
  - Verify installation: `npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Required Accounts

1. **Supabase Account** (Free tier available)
   - Sign up at [supabase.com](https://supabase.com)
   - Email verification required

2. **Google Cloud Console** (Optional, for OAuth)
   - Sign up at [console.cloud.google.com](https://console.cloud.google.com)
   - Required only if you want Google sign-in

3. **Railway Account** (For deployment)
   - Sign up at [railway.app](https://railway.app)
   - Can sign in with GitHub

## Local Development Setup

### Step 1: Clone and Install

```bash
# Navigate to your projects directory
cd ~/projects

# Clone the repository
git clone <your-repo-url>
cd taskmanager

# Install dependencies
npm install
```

### Step 2: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your configuration (we'll fill these in the next steps):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Configuration

### Step 1: Create a New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: team-task-manager (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

### Step 2: Get API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

Your `.env.local` should now look like:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Update the **Confirm signup** template:
   - Change redirect URL to: `{{ .SiteURL }}/auth/callback`
3. Update the **Reset password** template:
   - Change redirect URL to: `{{ .SiteURL }}/auth/reset-password`
4. Click **Save** for each template

### Step 4: Create Storage Bucket

1. Go to **Storage** → **Create bucket**
2. Fill in:
   - **Name**: `avatars`
   - **Public**: Uncheck (keep private)
   - **File size limit**: 2MB
   - **Allowed MIME types**: `image/jpeg, image/png`
3. Click **Create bucket**

4. Set up storage policies:
   - Click on the `avatars` bucket
   - Go to **Policies** tab
   - Add the following policies:

**Policy 1: Allow authenticated users to upload their own avatar**
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Allow authenticated users to read all avatars**
```sql
CREATE POLICY "Users can view all avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');
```

**Policy 3: Allow users to update their own avatar**
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Team Task Manager
   - User support email: Your email
   - Developer contact: Your email
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Replace with your Supabase project URL)
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to your Supabase project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle **Enable Sign in with Google**
5. Paste your **Client ID** and **Client Secret**
6. Click **Save**

## Database Migration

### Step 1: Link Supabase CLI

```bash
# Get your project reference from Supabase dashboard URL
# It looks like: https://app.supabase.com/project/xxxxxxxxxxxxx
# The xxxxxxxxxxxxx part is your project ref

npx supabase link --project-ref xxxxxxxxxxxxx
```

You'll be prompted for your database password (the one you set when creating the project).

### Step 2: Push Migration

```bash
npx supabase db push
```

This will:
- Create all tables (profiles, projects, project_members, tasks, comments, notifications)
- Set up Row Level Security policies
- Create indexes for performance
- Set up triggers for automation
- Create helper functions

### Step 3: Verify Migration

1. Go to **Database** → **Tables** in Supabase dashboard
2. You should see 6 tables:
   - profiles
   - projects
   - project_members
   - tasks
   - comments
   - notifications

### Step 4: Enable Realtime

1. Go to **Database** → **Replication**
2. Find the `tasks` table
3. Toggle **Enable** for replication
4. Click **Save**

### Step 5: Generate TypeScript Types

```bash
npx supabase gen types typescript --project-id xxxxxxxxxxxxx > types/database.types.ts
```

## Testing the Application

### Step 1: Start Development Server

```bash
npm run dev
```

The application should start at [http://localhost:3000](http://localhost:3000)

### Step 2: Test Sign Up Flow

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You should be redirected to `/login`
3. Click **"Sign up"**
4. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: testpassword123
   - Confirm Password: testpassword123
5. Click **"Sign Up"**
6. Check your email for verification link
7. Click the verification link
8. You should be redirected to login

### Step 3: Test Login Flow

1. Go to `/login`
2. Enter your credentials
3. Click **"Sign In"**
4. You should be redirected to `/dashboard`

### Step 4: Test Google OAuth (if configured)

1. Go to `/login`
2. Click **"Sign in with Google"**
3. Select your Google account
4. Grant permissions
5. You should be redirected to `/dashboard`

### Step 5: Verify Database

1. Go to Supabase Dashboard → **Table Editor**
2. Open the `profiles` table
3. You should see your user profile created automatically

## Running Tests

```bash
# Run all tests
npm run test

# Run unit tests with coverage
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests (requires dev server running)
npm run test:e2e
```

## Troubleshooting

### Issue: "Invalid API key"

**Solution**: 
- Verify your `.env.local` file has the correct keys
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

### Issue: "Failed to fetch"

**Solution**:
- Check if Supabase project is running (not paused)
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check your internet connection

### Issue: "Email not confirmed"

**Solution**:
- Check your spam folder for verification email
- In Supabase Dashboard, go to **Authentication** → **Users**
- Find your user and manually confirm email

### Issue: "Row Level Security policy violation"

**Solution**:
- Verify migration ran successfully: `npx supabase db push`
- Check RLS policies in **Database** → **Policies**
- Ensure you're logged in with a valid session

### Issue: Google OAuth not working

**Solution**:
- Verify redirect URI in Google Console matches Supabase exactly
- Check that Google provider is enabled in Supabase
- Ensure Client ID and Secret are correct
- Try in incognito mode to rule out cookie issues

### Issue: "Module not found" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**:
```bash
# Regenerate types
npx supabase gen types typescript --project-id xxxxxxxxxxxxx > types/database.types.ts

# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## Next Steps

Once your local setup is complete:

1. ✅ Create your first project
2. ✅ Invite team members
3. ✅ Create tasks and test the Kanban board
4. ✅ Test real-time updates (open in two browser tabs)
5. ✅ Deploy to Railway (see deployment guide)

## Getting Help

- **Documentation**: Check the main README.md
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Issues**: Open an issue on GitHub

---

**Setup complete! 🎉 You're ready to start building with Team Task Manager.**
