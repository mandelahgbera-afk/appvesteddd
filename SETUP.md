# 🚀 Vested - Complete Setup & Deployment Guide

> **Crypto Trading & Copytrading Platform with Dual Dashboards**

---

## 📋 Table of Contents

1. [Quick Start (5 Minutes)](#quick-start)
2. [Project Overview](#project-overview)
3. [Admin Login Details](#admin-login)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Connecting to Supabase](#connecting-to-supabase)
6. [Connecting to Resend (Email)](#connecting-to-resend)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start (5 Minutes)

### Default Admin Credentials

```
🔗 Admin Login URL: /admin-login

👤 Username: admin
🔒 Password: VestedAdmin2024!
```

> ⚠️ **IMPORTANT**: Change these credentials immediately after first login!

### Demo User Credentials

```
📧 Email: john.doe@example.com
🔒 Password: password
```

---

## 📖 Project Overview

### What You're Building

```
┌─────────────────────────────────────────────────────────────────┐
│                      VESTED PLATFORM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌐 PUBLIC PAGES                                                │
│  ├── Landing Page (/)                                           │
│  ├── User Sign In (/signin)                                     │
│  ├── User Sign Up (/signup)                                     │
│  └── Admin Login (/admin-login) ← Super Admin Only              │
│                                                                 │
│  👤 USER DASHBOARD (After Login)                                │
│  ├── Portfolio (/dashboard)                                     │
│  ├── Market (/market)                                           │
│  ├── Deposit (/deposit)                                         │
│  ├── Withdraw (/withdraw)                                       │
│  ├── Copy Traders (/copytraders)                                │
│  ├── Transactions (/transactions)                               │
│  └── Profile (/profile)                                         │
│                                                                 │
│  🔐 ADMIN DASHBOARD (After Admin Login)                         │
│  ├── Overview                                                   │
│  ├── Users Management                                           │
│  ├── Cryptocurrencies                                           │
│  ├── Copy Traders                                               │
│  ├── Transactions                                               │
│  └── Settings (Change admin credentials here!)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) |
| **Email** | Resend |
| **Hosting** | Vercel |

---

## 🔐 Admin Login Details

### Login URL Structure

When you deploy to your domain, the admin login will be at:

```
https://your-domain.com/admin-login
```

### Default Credentials (Pre-configured)

```yaml
Username: admin
Password: VestedAdmin2024!
```

### How to Change Admin Credentials

1. **Log in as admin** at `/admin-login`
2. **Navigate to** `Settings` tab
3. **Scroll to** `Admin Credentials` section
4. **Enter your current password**
5. **Set new username** (optional)
6. **Set new password** (optional, min 8 characters)
7. **Click** `Update Credentials`

```
┌────────────────────────────────────────┐
│     Admin Credentials Section          │
├────────────────────────────────────────┤
│                                        │
│  Current Username: [admin        ]     │
│  Last Login: [2024-03-20 14:30:00]     │
│  ─────────────────────────────────     │
│  Change Credentials:                   │
│                                        │
│  Current Password *                    │
│  [••••••••••••••••••••••••••] 👁️      │
│                                        │
│  New Username (optional)               │
│  [new_admin_name               ]       │
│                                        │
│  New Password (optional)               │
│  [••••••••••••••••••••••••••] 👁️      │
│                                        │
│  Confirm New Password                  │
│  [••••••••••••••••••••••••••] 👁️      │
│                                        │
│  [💾 Update Credentials]               │
│                                        │
└────────────────────────────────────────┘
```

> 🔒 **Security Note**: Only the super admin can change admin credentials. There is no "forgot password" feature for security reasons.

---

## 🛠️ Step-by-Step Setup

### Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] A GitHub account
- [ ] A Vercel account (free)
- [ ] A Supabase account (free)

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd vested-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Your app should now be running at `http://localhost:5173`

### Step 2: Test Locally (3 minutes)

1. **Open** `http://localhost:5173`
2. **Click** "Admin" in the top navigation
3. **Login** with:
   - Username: `admin`
   - Password: `VestedAdmin2024!`
4. **Explore** the admin dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    TESTING CHECKLIST                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ☐ Landing page loads correctly                             │
│  ☐ Admin login works (/admin-login)                         │
│  ☐ Can access admin dashboard                               │
│  ☐ Can view users list                                      │
│  ☐ Can view cryptocurrencies                                │
│  ☐ Can view transactions                                    │
│  ☐ Can change admin credentials in Settings                 │
│  ☐ User sign up works                                       │
│  ☐ User login works                                         │
│  ☐ User dashboard loads                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vested platform"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/vested-platform.git

# Push
git push -u origin main
```

---

## 🗄️ Connecting to Supabase

### Why Supabase?

Supabase provides:
- ✅ **PostgreSQL Database** - Industry standard, reliable
- ✅ **Built-in Auth** - User authentication out of the box
- ✅ **Row Level Security** - Fine-grained access control
- ✅ **Real-time Subscriptions** - Live data updates
- ✅ **Free Tier** - Generous limits for startups

### Setup Instructions

#### Step 1: Create Supabase Project (3 minutes)

```
1. Go to https://supabase.com
2. Click "New Project"
3. Enter project name: "vested-platform"
4. Choose region closest to your users
5. Click "Create new project"
```

#### Step 2: Run the Schema (5 minutes)

```
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Copy the ENTIRE contents of schema.sql
4. Paste into the SQL editor
5. Click "Run"
```

**Visual Guide:**

```
Supabase Dashboard
│
├── 📁 Database
│   └── 📝 SQL Editor ← Click here
│       └── [New query]
│           │
│           │  ┌─────────────────────────────────────┐
│           │  │  -- Paste schema.sql content here   │
│           │  │  CREATE TABLE public.users (...     │
│           │  │  ...                                │
│           │  └─────────────────────────────────────┘
│           │
│           └── [▶ Run] ← Click to execute
│
└── ⚙️ Settings
    └── API ← You'll need this next
```

#### Step 3: Get Your API Keys (2 minutes)

```
1. In Supabase, go to Project Settings (gear icon)
2. Click "API" in the left sidebar
3. Copy these values:
```

| Value | Location | Example |
|-------|----------|---------|
| `SUPABASE_URL` | Project URL | `https://abcdefgh12345678.supabase.co` |
| `SUPABASE_ANON_KEY` | anon/public | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role | `eyJhbGciOiJIUzI1NiIs...` |

```
┌─────────────────────────────────────────────────────────┐
│  Project Settings → API                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Project URL                                            │
│  [https://xxxxx.supabase.co] 📋 ← Copy this           │
│                                                         │
│  Project API keys                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ anon/public                                     │   │
│  │ [eyJhbGci...] 📋 ← Copy this (for frontend)   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ service_role (SECRET)                           │   │
│  │ [eyJhbGci...] 📋 ← Copy this (for backend)    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Step 4: Update Your Code (5 minutes)

Create a `.env` file in your project root:

```bash
# .env file
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Then update `src/lib/supabase.ts` (you'll need to create this file):

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

---

## 📧 Connecting to Resend (Email Notifications)

### Why Resend?

Resend is the easiest way to send transactional emails:
- ✅ Simple API
- ✅ Great deliverability
- ✅ Free tier (3,000 emails/month)
- ✅ React Email support

### Setup Instructions

#### Step 1: Create Resend Account (2 minutes)

```
1. Go to https://resend.com
2. Sign up with your email
3. Verify your email
4. Complete profile
```

#### Step 2: Get API Key (1 minute)

```
1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
3. Name: "Vested Platform"
4. Permissions: Sending access
5. Copy the key
```

```
Resend Dashboard
│
├── 🔑 API Keys ← Click here
│   └── [+ Create API Key]
│       │
│       │  Name: [Vested Platform    ]
│       │  Permission: [Sending access ▼]
│       │
│       └── [Create]
│           │
│           └── 📋 re_xxxxxxxxxxxxx ← Copy this!
│
└── 📧 Domains
    └── Add your domain for better deliverability
```

#### Step 3: Add to Environment Variables

```bash
# Add to .env
VITE_RESEND_API_KEY=re_your_api_key_here
```

---

## 🌐 Custom Domain Setup

### Step 1: Buy a Domain

Recommended registrars:
- Namecheap (cheap, good support)
- Cloudflare (wholesale pricing)
- Google Domains (simple, integrated)

### Step 2: Connect Domain to Vercel

```
1. In Vercel dashboard, select your project
2. Go to "Settings" → "Domains"
3. Enter your domain: yourdomain.com
4. Click "Add"
5. Vercel will show you DNS records to add
```

### Step 3: Configure DNS

```
Add these DNS records at your domain registrar:

Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

```
DNS Configuration
┌─────────────────────────────────────────┐
│  Type  │  Name  │  Value               │
├─────────────────────────────────────────┤
│  A     │  @     │  76.76.21.21        │
│  CNAME │  www   │  cname.vercel-dns.com│
└─────────────────────────────────────────┘
```

### Step 4: Admin Login URL

Once your domain is connected:

```
🌐 Your Admin Login URL:
https://yourdomain.com/admin-login

Example:
https://vested.com/admin-login
https://app.vested.com/admin-login
https://vested-platform.com/admin-login
```

---

## 🔒 Security Best Practices

### 1. Change Default Admin Password

```
⚠️ CRITICAL: Do this immediately after first login!

1. Login at /admin-login
2. Go to Settings
3. Change username (optional but recommended)
4. Change password (required!)
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
```

### 2. Enable Environment Variables

```bash
# Never commit these to git!
# Add to .gitignore:
.env
.env.local
.env.production
```

### 3. Set Up Row Level Security (RLS)

Our schema already includes RLS policies, but verify they're active:

```sql
-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname IN ('users', 'transactions', 'cryptos');

-- Should show "t" (true) for relrowsecurity
```

### 4. Use Strong Database Passwords

```
❌ Bad: password123
❌ Bad: admin
✅ Good: xK9#mP2$vL7@qR4!
```

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials" on admin login

**Solution:**
```
1. Check you're using the correct URL: /admin-login
2. Default credentials:
   - Username: admin
   - Password: VestedAdmin2024!
3. Check CAPS LOCK is off
4. Try clearing browser cache
```

### Issue: "Database connection failed"

**Solution:**
```
1. Check SUPABASE_URL in .env is correct
2. Check SUPABASE_ANON_KEY is correct
3. Verify Supabase project is active
4. Check your internet connection
```

### Issue: "Build failed on Vercel"

**Solution:**
```
1. Check package.json has correct build script
2. Verify all dependencies are in package.json
3. Check for TypeScript errors: npm run build locally
4. Check Vercel build logs for specific errors
```

### Issue: "Emails not sending"

**Solution:**
```
1. Verify RESEND_API_KEY is correct
2. Check you're using a verified domain
3. Check spam folders
4. Verify email templates exist in database
```

---

## 📁 Project Structure

```
vested-platform/
│
├── 📁 src/
│   ├── 📁 components/
│   │   └── 📁 ui/           # shadcn/ui components
│   │
│   ├── 📁 contexts/
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── ToastContext.tsx  # Notifications
│   │
│   ├── 📁 lib/
│   │   ├── mockData.ts       # Mock data (replace with Supabase)
│   │   └── utils.ts          # Utility functions
│   │
│   ├── 📁 sections/
│   │   ├── 📁 admin/         # Admin dashboard pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminOverview.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── AdminCryptos.tsx
│   │   │   ├── AdminTraders.tsx
│   │   │   ├── AdminTransactions.tsx
│   │   │   └── AdminSettings.tsx  # ← Change credentials here!
│   │   │
│   │   ├── 📁 auth/          # Authentication pages
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   └── AdminLoginPage.tsx  # ← Admin login page
│   │   │
│   │   ├── 📁 landing/       # Landing page
│   │   │   └── LandingPage.tsx
│   │   │
│   │   └── 📁 user/          # User dashboard pages
│   │       ├── UserDashboard.tsx
│   │       ├── PortfolioView.tsx
│   │       ├── MarketView.tsx
│   │       ├── DepositView.tsx
│   │       ├── WithdrawView.tsx
│   │       ├── CopytradersView.tsx
│   │       ├── ProfileView.tsx
│   │       └── TransactionsView.tsx
│   │
│   ├── 📁 types/
│   │   └── index.ts          # TypeScript types
│   │
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.tsx              # Entry point
│
├── 📄 .env.example           # Environment variables template
├── 📄 schema.sql             # Database schema
├── 📄 SETUP.md               # This file!
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
└── 📄 vite.config.ts
```

---

## 🎯 Deployment Checklist

Before going live, verify:

```
☐ Admin credentials changed from defaults
☐ Supabase project created and schema applied
☐ Environment variables configured
☐ Domain connected (optional but recommended)
☐ Email service configured (optional)
☐ Tested all user flows
☐ Tested all admin flows
☐ Checked mobile responsiveness
☐ Verified all links work
☐ Set up monitoring (optional)
```

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the code comments
3. Check browser console for errors
4. Verify your environment variables
5. Test with the mock data first

---

## 📄 License

This project is licensed under the MIT License - feel free to use for educational and commercial purposes.

---

## 🙏 Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [Recharts](https://recharts.org)

---

**Happy Building! 🚀**

*Last updated: 2024*
