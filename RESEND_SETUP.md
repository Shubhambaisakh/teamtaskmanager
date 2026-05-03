# Resend Email Integration Setup

This guide will help you set up Resend for sending emails in your Team Task Manager application.

## Why Resend?

Supabase has email rate limits (3-4 emails per hour by default). Resend provides:
- **100 emails/day** on free tier
- **3,000 emails/month** on free tier
- Reliable delivery
- Easy integration
- Beautiful email templates

## Setup Steps

### 1. Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Team Task Manager")
4. Copy the API key (starts with `re_`)

### 3. Add API Key to Environment Variables

Add to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
```

### 4. Verify Your Domain (Optional but Recommended)

For production, verify your domain to send emails from your own domain:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)

Once verified, update `FROM_EMAIL` in `lib/email.ts`:

```typescript
const FROM_EMAIL = 'noreply@yourdomain.com';
```

### 5. Test Email Sending

You can test email sending by calling any of the email functions:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail('user@example.com', 'John Doe');
```

## Available Email Functions

### 1. Welcome Email
```typescript
sendWelcomeEmail(to: string, userName: string)
```

### 2. Task Assignment Email
```typescript
sendTaskAssignmentEmail(
  to: string,
  userName: string,
  taskTitle: string,
  projectName: string,
  taskUrl: string
)
```

### 3. Password Reset Email
```typescript
sendPasswordResetEmail(
  to: string,
  userName: string,
  resetUrl: string
)
```

### 4. Comment Notification Email
```typescript
sendCommentNotificationEmail(
  to: string,
  userName: string,
  commenterName: string,
  taskTitle: string,
  commentBody: string,
  taskUrl: string
)
```

### 5. Project Invitation Email
```typescript
sendProjectInvitationEmail(
  to: string,
  inviteeName: string,
  inviterName: string,
  projectName: string,
  projectUrl: string
)
```

## Integration Examples

### Send Welcome Email on Signup

In your signup API route:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

// After successful signup
const { data: { user } } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name }
  }
});

if (user) {
  await sendWelcomeEmail(user.email!, full_name);
}
```

### Send Task Assignment Email

In your task creation API route:

```typescript
import { sendTaskAssignmentEmail } from '@/lib/email';

// After creating task with assignee
if (task.assignee_id) {
  const { data: assignee } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', task.assignee_id)
    .single();

  if (assignee) {
    const taskUrl = `${process.env.NEXT_PUBLIC_APP_URL}/projects/${task.project_id}/board`;
    await sendTaskAssignmentEmail(
      assignee.email,
      assignee.full_name,
      task.title,
      projectName,
      taskUrl
    );
  }
}
```

## Rate Limits

### Free Tier
- 100 emails per day
- 3,000 emails per month
- No credit card required

### Paid Plans
- Pro: $20/month - 50,000 emails/month
- Business: Custom pricing

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Make sure `RESEND_API_KEY` is set in `.env.local`
2. **Check Console**: Look for error messages in server logs
3. **Verify Domain**: If using custom domain, ensure DNS records are correct
4. **Check Spam**: Emails might be in spam folder

### Rate Limit Exceeded

If you hit the free tier limit:
1. Upgrade to paid plan
2. Implement email queuing
3. Batch notifications

## Best Practices

1. **Use Environment Variables**: Never hardcode API keys
2. **Handle Errors**: Always wrap email sending in try-catch
3. **Don't Block Requests**: Send emails asynchronously
4. **Test Thoroughly**: Test all email templates before production
5. **Monitor Usage**: Check Resend dashboard regularly

## Production Deployment

For Railway deployment, add environment variable:

```bash
railway variables set RESEND_API_KEY=re_your_api_key_here
```

## Support

- Resend Docs: [https://resend.com/docs](https://resend.com/docs)
- Resend Support: [https://resend.com/support](https://resend.com/support)

---

**Note**: The default `FROM_EMAIL` is `onboarding@resend.dev` which works for testing. For production, verify your own domain and update the email address.
