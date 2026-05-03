# Disable Email Confirmation (Development Only)

If you want to disable email confirmation during development:

## Option 1: Supabase Dashboard (Recommended for Dev)

1. Go to Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find **"Confirm email"** toggle
4. **Disable it** for development
5. Click **Save**

Now users can login immediately without email verification!

## Option 2: Auto-confirm in Code

Keep email confirmation enabled but auto-confirm in development:

```typescript
// In your signup code
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    data: { full_name }
  }
});

// For development, you can manually confirm
if (process.env.NODE_ENV === 'development') {
  // User can login immediately
}
```

## Option 3: Use Magic Link Instead

Instead of password, use magic link (no confirmation needed):

```typescript
const { data, error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  }
});
```

## For Production

**Always keep email confirmation enabled in production for security!**

Re-enable it before deploying:
1. Supabase Dashboard → Authentication → Email
2. Enable "Confirm email"
3. Configure SMTP with Resend (as per SUPABASE_RESEND_SMTP_SETUP.md)
