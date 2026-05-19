# Supabase backend setup

Spider Mobiles uses Supabase for **customer auth, database, and SMTP email**. Follow these one-time steps to wire it up.

## 1. Create / connect your Supabase project

If you already have one, skip to step 2. Otherwise:

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon public key** from *Settings → API*
3. In your project root, create `.env.local`:

   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
   ```

## 2. Run the SQL migration

In the Supabase dashboard → **SQL Editor** → New query → paste the contents of [`migrations/20260519_customer_auth.sql`](migrations/20260519_customer_auth.sql) → Run.

This creates `customer_profiles`, adds columns to `bookings`, sets up RLS, and a trigger that auto-creates a profile on signup.

## 3. Enable auth providers

Dashboard → **Authentication → Providers**:

- **Email** — enable. Toggle "Confirm email" ON.
- **Google** — enable. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials):
  - Authorised JS origins: `https://YOUR_DOMAIN`, `http://localhost:5173`
  - Authorised redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
  - Paste Client ID & Secret back into Supabase

## 4. Configure SMTP (your sending email)

Dashboard → **Project Settings → Auth → SMTP Settings** → enable custom SMTP and fill in:

| Field | Example |
|---|---|
| Sender email | `hello@spidermobiles.co.uk` |
| Sender name | `Spider Mobiles Derby` |
| SMTP host | `smtp.gmail.com` *(Gmail)* / `smtp.zoho.eu` *(Zoho)* / `smtp.sendgrid.net` *(SendGrid)* |
| Port | `587` (STARTTLS) or `465` (SSL) |
| Username | usually your sender email |
| Password | for Gmail, generate an **App password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Never your normal password. |

This handles **signup confirmation, password reset, magic links**.

## 5. Deploy the booking-email Edge Function

This sends the branded "Booking confirmed" email after a customer completes the booking flow.

```bash
# One-off: install Supabase CLI
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Set SMTP secrets (same values as step 4, or different if you want a different sender)
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USERNAME=hello@spidermobiles.co.uk
supabase secrets set SMTP_PASSWORD=your_app_password
supabase secrets set SMTP_FROM="Spider Mobiles Derby <hello@spidermobiles.co.uk>"
supabase secrets set SMTP_TLS=false    # true if you used port 465

# Deploy the function
supabase functions deploy send-booking-email --no-verify-jwt
```

> The Edge Function is invoked client-side after a booking is created. If SMTP isn't configured yet, the booking is still saved — only the confirmation email fails silently (graceful degradation).

## 6. Test

1. Sign up at `/signup` → check inbox for confirmation
2. Confirm → land at `/account`
3. Book a repair at `/book` → confirmation email arrives
4. View it at `/track` and `/account`

## Email-sending architecture (summary)

| Email | Trigger | Sender |
|---|---|---|
| Signup confirmation | `auth.signUp()` | Supabase Auth using your SMTP |
| Password reset | `auth.resetPasswordForEmail()` | Supabase Auth using your SMTP |
| Booking confirmation | Booking created → `functions.invoke('send-booking-email')` | Edge Function using your SMTP |

Same SMTP credentials power all three.
