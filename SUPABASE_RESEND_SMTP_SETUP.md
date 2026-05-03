# Supabase + Resend SMTP Configuration

This guide will configure Supabase to use Resend for ALL authentication emails (signup, password reset, magic links, etc.)

## Why This Approach?

- ✅ Bypasses Supabase email rate limits completely
- ✅ All auth emails go through Resend (100/day, 3000/month free)
- ✅ No code changes needed - Supabase handles everything
- ✅ Works with all Supabase Auth features

---

## Step 1: Get Resend SMTP Credentials

### 1.1 Create Resend API Key (If Not Done)

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it "Supabase SMTP"
4. Copy the API key (starts with `re_`)

### 1.2 Get SMTP Credentials

Resend SMTP credentials are:

```
SMTP Host: smtp.resend.com
SMTP Port: 465 (SSL) or 587 (TLS)
SMTP Username: resend
SMTP Password: YOUR_RESEND_API_KEY (the key you just created)
```

**Important:** Your SMTP password is your Resend API key!

---

## Step 2: Configure Supabase Dashboard

### 2.1 Navigate to SMTP Settings

1. Go to your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **aeedlewstzxreztohtpl**
3. Go to: **Authentication** → **Email Templates** → **SMTP Settings**

### 2.2 Enable Custom SMTP

Click **"Enable Custom SMTP"**

### 2.3 Enter SMTP Configuration

Fill in these details:

```
Sender Name: Team Task Manager
Sender Email: onboarding@resend.dev
              (or your verified domain email like noreply@yourdomain.com)

Host: smtp.resend.com
Port: 465
Username: resend
Password: YOUR_RESEND_API_KEY

Encryption: SSL/TLS
```

### 2.4 Test Configuration

1. Click **"Send Test Email"**
2. Enter your email address
3. Check your inbox (and spam folder)
4. If email arrives, configuration is correct! ✅

### 2.5 Save Settings

Click **"Save"** to apply the configuration.

---

## Step 3: Verify Domain (Optional but Recommended)

For production, verify your own domain in Resend:

### 3.1 Add Domain in Resend

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)

### 3.2 Add DNS Records

Resend will show you DNS records to add. Add these to your domain provider:

**Example DNS Records:**
```
Type: TXT
Name: @
Value: resend-verification=xxxxx

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; ...
```

### 3.3 Wait for Verification

- Usually takes 5-15 minutes
- Check status in Resend dashboard
- Once verified, update Sender Email in Supabase

### 3.4 Update Supabase Sender Email

Go back to Supabase SMTP Settings and update:

```
Sender Email: noreply@yourdomain.com
```

---

## Step 4: Customize Email Templates (Optional)

### 4.1 Navigate to Email Templates

In Supabase Dashboard:
**Authentication** → **Email Templates**

### 4.2 Available Templates

You can customize:
- **Confirm Signup** - Email verification
- **Magic Link** - Passwordless login
- **Change Email Address** - Email change confirmation
- **Reset Password** - Password reset link

### 4.3 Template Variables

Available variables:
- `{{ .ConfirmationURL }}` - Verification/reset link
- `{{ .Token }}` - OTP token
- `{{ .SiteURL }}` - Your app URL
- `{{ .Email }}` - User's email

### 4.4 Example Custom Template

**Confirm Signup Template:**

```html
<h2>Welcome to Team Task Manager!</h2>
<p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>
<p>This link expires in 24 hours.</p>
<p>If you didn't sign up, you can safely ignore this email.</p>
```

---

## Step 5: Test Authentication Emails

### 5.1 Test Signup Email

1. Go to your app: `http://localhost:3001/signup`
2. Create a new account with a test email
3. Check inbox for verification email
4. Email should come from Resend (check email headers)

### 5.2 Test Password Reset Email

1. Go to: `http://localhost:3001/forgot-password`
2. Enter your email
3. Check inbox for reset email
4. Click reset link and verify it works

### 5.3 Verify Email Source

Check email headers to confirm it's from Resend:
- Look for `smtp.resend.com` in headers
- Check "Received" headers

---

## Troubleshooting

### Email Not Sending

**Check 1: SMTP Credentials**
- Verify API key is correct
- Username must be exactly `resend`
- Port is 465 (SSL) or 587 (TLS)

**Check 2: Resend Dashboard**
- Go to [https://resend.com/emails](https://resend.com/emails)
- Check if emails are being sent
- Look for error messages

**Check 3: Supabase Logs**
- Go to Supabase Dashboard → Logs
- Filter by "auth" logs
- Look for SMTP errors

### Email Goes to Spam

**Solution 1: Verify Domain**
- Add SPF, DKIM, DMARC records
- Use your own domain instead of `resend.dev`

**Solution 2: Warm Up Domain**
- Start with low volume
- Gradually increase sending

### Rate Limit Errors

**Free Tier Limits:**
- 100 emails/day
- 3,000 emails/month

**Solution:**
- Upgrade to Resend Pro ($20/month)
- Or implement email queuing

---

## Production Checklist

Before going live:

- [ ] Verify your domain in Resend
- [ ] Update Sender Email to your domain
- [ ] Test all email templates
- [ ] Customize email templates with branding
- [ ] Set up SPF, DKIM, DMARC records
- [ ] Test email delivery to major providers (Gmail, Outlook, Yahoo)
- [ ] Monitor Resend dashboard for delivery issues
- [ ] Set up email alerts in Resend

---

## Monitoring & Analytics

### Resend Dashboard

Monitor in real-time:
- [https://resend.com/emails](https://resend.com/emails)

Track:
- Emails sent
- Delivery rate
- Bounce rate
- Open rate (if tracking enabled)

### Supabase Logs

Check auth logs:
- Supabase Dashboard → Logs → Auth Logs
- Filter by email events

---

## Cost Breakdown

### Free Tier
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ No credit card required
- ✅ Perfect for development and small apps

### Pro Plan ($20/month)
- ✅ 50,000 emails/month
- ✅ Custom domains
- ✅ Priority support
- ✅ Advanced analytics

---

## Support

- **Resend Docs:** [https://resend.com/docs/send-with-smtp](https://resend.com/docs/send-with-smtp)
- **Supabase SMTP Docs:** [https://supabase.com/docs/guides/auth/auth-smtp](https://supabase.com/docs/guides/auth/auth-smtp)
- **Resend Support:** [https://resend.com/support](https://resend.com/support)

---

## Quick Reference

### SMTP Settings Summary

```
Host: smtp.resend.com
Port: 465 (SSL) or 587 (TLS)
Username: resend
Password: YOUR_RESEND_API_KEY
Sender: onboarding@resend.dev (or your domain)
```

### Environment Variables Needed

```env
# In .env.local (for custom email functions)
RESEND_API_KEY=re_your_api_key_here

# In Supabase Dashboard SMTP Settings
# (entered via UI, not in .env)
```

---

**That's it! Your authentication emails now go through Resend with no rate limits!** 🚀
