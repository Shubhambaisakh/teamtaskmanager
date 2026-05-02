# Team Task Manager

A production-grade, full-stack team task management platform with role-based access control built with Next.js 15, Supabase, and TypeScript.

## 🚀 Features

- **Authentication**: Email/password and Google OAuth sign-in with Supabase Auth
- **Role-Based Access Control**: Two-tier permission system (Admin/Member) enforced at database and API layers
- **Project Management**: Create, organize, and track projects with team collaboration
- **Task Management**: Kanban board and list views with drag-and-drop functionality
- **Real-Time Updates**: Live task updates using Supabase Realtime
- **Comments & Activity**: Task-level discussions with soft-delete support
- **Notifications**: In-app notifications for task assignments and updates
- **Global Search**: Full-text search across projects and tasks
- **Responsive Design**: Mobile-first UI with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-Time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **State Management**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Railway

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Railway account ([sign up here](https://railway.app)) - for deployment
- A Google Cloud Console project (for OAuth) - optional

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd taskmanager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project in [Supabase Dashboard](https://app.supabase.com)
2. Go to **Project Settings** → **API** and copy:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secure!)

3. Enable Google OAuth (optional):
   - Go to **Authentication** → **Providers**
   - Enable Google provider
   - Add your Google OAuth credentials

4. Create the `avatars` storage bucket:
   - Go to **Storage** → **Create bucket**
   - Name: `avatars`
   - Public: No
   - Set policies for authenticated users

5. Enable Realtime:
   - Go to **Database** → **Replication**
   - Enable replication for the `tasks` table

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Database Migrations

```bash
# Link to your Supabase project
npx supabase link --project-ref your_project_ref

# Push the migration
npx supabase db push
```

### 6. Generate TypeScript Types

```bash
npx supabase gen types typescript --project-id your_project_ref > types/database.types.ts
```

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run unit tests with coverage
npm run test:unit

# Run integration tests
npm run test:integration

# Run property-based tests
npm run test:properties

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 📁 Project Structure

```
taskmanager/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   └── auth/                # Auth callbacks
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── projects/            # Project-related components
│   ├── tasks/               # Task-related components
│   └── shared/              # Shared components
├── lib/
│   ├── supabase/            # Supabase client setup
│   ├── validations/         # Zod schemas
│   └── utils.ts             # Utility functions
├── supabase/
│   └── migrations/          # Database migrations
├── __tests__/               # Test files
│   ├── unit/
│   ├── integration/
│   ├── properties/
│   └── e2e/
└── types/                   # TypeScript type definitions
```

## 🔐 Security Features

- Row Level Security (RLS) policies on all tables
- Server-side session validation
- CSRF protection via SameSite cookies
- Content Security Policy headers
- XSS prevention through input sanitization
- Secure password requirements (min 8 characters)
- Service role key never exposed to client

## 🚢 Deployment

### Deploy to Railway

1. Push your code to GitHub
2. Connect your repository to Railway
3. Add environment variables in Railway dashboard
4. Railway will automatically deploy on every push to main

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

## 📝 Database Schema

The application uses the following main tables:

- **profiles**: User profiles (extends auth.users)
- **projects**: Project containers
- **project_members**: User-project relationships with roles
- **tasks**: Task items with status, priority, and assignments
- **comments**: Task comments with soft-delete support
- **notifications**: User notifications

All tables have Row Level Security enabled with appropriate policies.

## 🎯 Roadmap

- [x] Phase 0: Pre-Implementation Setup
- [x] Phase 1: Project Foundation & Infrastructure
- [x] Phase 2: Authentication Pages
- [x] Phase 3: Core Layout & Navigation
- [x] Phase 4: Project Management
- [x] Phase 5: Task Management (APIs)
- [x] Phase 6: Dashboard & Member Management
- [x] Phase 7: Notifications & Search (APIs)
- [ ] Phase 8: User Profile & Settings
- [ ] Phase 9: Performance & Accessibility
- [ ] Phase 10: Deployment & Documentation
- [ ] Phase 11: End-to-End Testing & Launch

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Railway](https://railway.app/)

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js 15 and Supabase**
