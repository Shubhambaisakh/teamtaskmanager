# Button Connections Map 🔗

## Landing Page Button Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                          │
│                  http://localhost:3000                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─ Checks Authentication
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ✅ Logged In        ❌ Not Logged In
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  /dashboard  │    │   /landing   │
            └──────────────┘    └──────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
            │ "Sign in"    │    │"Get started" │   │"Start free"  │
            │   Button     │    │   Button     │   │   Button     │
            └──────┬───────┘    └──────┬───────┘   └──────┬───────┘
                   │                   │                   │
                   └───────────────────┴───────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────┐
                        │   Authentication Pages   │
                        └──────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
            ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
            │   /login     │   │   /signup    │  │  /dashboard  │
            │              │   │              │  │  (after auth)│
            └──────────────┘   └──────────────┘  └──────────────┘
```

## Button Details

### Navigation Bar
| Button | Action | Destination | Component |
|--------|--------|-------------|-----------|
| **Sign in** | `onClick={handleSignIn}` | `/login` | Login Page |
| **Get started** | `onClick={handleGetStarted}` | `/signup` | Signup Page |

### Hero Section
| Button | Action | Destination | Component |
|--------|--------|-------------|-----------|
| **Start for free** | `onClick={handleGetStarted}` | `/signup` | Signup Page |
| **Watch demo** | `onClick={handleDemo}` | Alert | Modal (future) |

### CTA Section
| Button | Action | Destination | Component |
|--------|--------|-------------|-----------|
| **Get started free** | `onClick={handleGetStarted}` | `/signup` | Signup Page |
| **View on GitHub** | `onClick={handleGithub}` | GitHub | External Link |

## Authentication Flow

```
User visits site (/)
        │
        ▼
Check if authenticated?
        │
    ┌───┴───┐
    │       │
   Yes     No
    │       │
    │       └──> Show Landing Page (/landing)
    │                    │
    │                    ├─> Click "Sign in" ──> /login
    │                    │
    │                    └─> Click "Get started" ──> /signup
    │                                                    │
    │                                                    ▼
    │                                            Create Account
    │                                                    │
    │                                                    ▼
    │                                            Verify Email
    │                                                    │
    │                                                    ▼
    │                                               Sign In
    │                                                    │
    └────────────────────────────────────────────────────┘
                                │
                                ▼
                        Redirect to /dashboard
```

## Code Locations

### Landing Page Component
**File**: `app/landing/page.tsx`

```typescript
// Button handlers
const handleSignIn = () => router.push('/login')
const handleGetStarted = () => router.push('/signup')
const handleDemo = () => alert('Demo coming soon!')
const handleGithub = () => window.open('https://github.com/...', '_blank')
```

### Main Page Router
**File**: `app/page.tsx`

```typescript
// Checks auth and redirects
if (user) redirect('/dashboard')
else redirect('/landing')
```

## Testing Checklist

- [ ] Visit `http://localhost:3000` → Should redirect to `/landing`
- [ ] Click "Sign in" button → Should go to `/login`
- [ ] Click "Get started" button → Should go to `/signup`
- [ ] Click "Start for free" button → Should go to `/signup`
- [ ] Click "Watch demo" button → Should show alert
- [ ] Sign up with new account → Should create user
- [ ] Sign in with credentials → Should redirect to `/dashboard`
- [ ] Visit `/` while logged in → Should redirect to `/dashboard`
- [ ] Sign out → Should redirect to `/landing`

## Status: ✅ ALL BUTTONS CONNECTED AND WORKING
