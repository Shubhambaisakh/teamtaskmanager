# Team Task Manager

A production-grade collaborative task management platform with role-based access control, real-time updates, and a full-featured Kanban board.

## Live Demo

> Deploy to Railway and update this link.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query |
| Drag & Drop | dnd-kit |
| Validation | Zod + React Hook Form |
| Testing | Vitest + Playwright + fast-check |
| Deployment | Railway |

---

## Key Features

- **Authentication** — Email/password signup, Google OAuth, password reset
- **Role-Based Access Control** — Admin (full control) and Member (status updates only) roles
- **Projects** — Create, edit, archive, delete projects with member management
- **Kanban Board** — Drag-and-drop task management across 4 status columns
- **Task List View** — Sortable, filterable table with bookmarkable URL filters
- **Task Detail Sheet** — Full task editing with comments, inline in a slide-over panel
- **Comments** — Threaded comments with soft delete and edit history
- **Real-Time Updates** — Live task and notification updates via Supabase Realtime
- **Notifications** — In-app notifications with unread badge and mark-as-read
- **Global Search** — Full-text search across projects and tasks
- **Dashboard** — Stats overview, My Tasks list, project progress bars

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase account (free tier works)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd taskmanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your values (see [Environment Variables](#environment-variables) below).

4. **Apply database migrations**
   ```bash
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Where to Find |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `http://localhost:3000` locally, Railway URL in production |

---

## Deployment Guide (Railway)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create a Railway project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Set environment variables in Railway**
   - Go to your service → Variables
   - Add all variables from the table above

4. **Trigger first deployment**
   - Railway auto-deploys on push to `main`
   - Check the build logs for any errors

5. **Update Supabase Auth settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set **Site URL** to your Railway URL
   - Add your Railway URL to **Redirect URLs**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 (App Router)               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Server      │  │  Client      │  │  API Routes   │  │
│  │  Components  │  │  Components  │  │  /api/**      │  │
│  │  (RSC)       │  │  ('use       │  │               │  │
│  │              │  │   client')   │  │               │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                  │           │
└─────────┼─────────────────┼──────────────────┼───────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase                              │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  PostgreSQL  │  │  Auth        │  │  Realtime     │  │
│  │  + RLS       │  │  (Email +    │  │  (WebSockets) │  │
│  │              │  │   OAuth)     │  │               │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
profiles          projects          project_members
─────────         ─────────         ───────────────
id (PK)           id (PK)           id (PK)
full_name         name              project_id (FK)
email             description       user_id (FK)
avatar_url        archived_at       role (admin|member)
created_at        created_at        joined_at
updated_at        updated_at

tasks             comments          notifications
─────────         ─────────         ─────────────
id (PK)           id (PK)           id (PK)
project_id (FK)   task_id (FK)      user_id (FK)
title             author_id (FK)    type
description       body              message
status            created_at        task_id (FK)
priority          updated_at        read
assignee_id (FK)  deleted_at        read_at
due_date                            created_at
completed_at
created_at
updated_at
```

---

## Running Tests

```bash
# All tests
npm test

# Unit tests with coverage
npm run test:unit

# Integration tests
npm run test:integration

# Property-based tests
npm run test:properties

# E2E tests (requires running dev server)
npm run test:e2e
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT
