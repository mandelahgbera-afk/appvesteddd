# Vested Crypto Platform - Deployment Guide

## Overview

This guide covers deploying the Vested crypto trading platform to Vercel with full Supabase integration.

## Pre-Deployment Checklist

### 1. Database Setup

```bash
# Run the RLS policy fix migration in Supabase
# Navigate to SQL Editor in Supabase dashboard and run:
scripts/01-fix-rls-policies.sql
```

### 2. Environment Variables

Set up the following environment variables in Vercel:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Optional: For server-side operations (if needed)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
```

### 3. Build Configuration

The project uses Vite for bundling. Ensure:
- Node.js 18+ is installed
- `package.json` dependencies are up to date
- `vite.config.ts` is properly configured

### 4. Testing Before Deployment

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment Steps

### Option 1: Deploy with Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

2. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add all variables from "Environment Variables" section above
   - Apply to: Production, Preview, Development

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Visit deployment URL

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables during deployment
# Or use: vercel env pull .env.production.local
```

## Post-Deployment Verification

### 1. Check Deployment Health

```bash
# Visit your deployment URL and verify:
- [ ] Homepage loads
- [ ] Authentication works (sign up / sign in)
- [ ] Data loads without errors
- [ ] Browser console has no errors
```

### 2. Test Key Features

- Sign up with new account
- View portfolio (should be empty)
- Attempt deposit (should create pending transaction)
- Check transactions page
- View empty states for new users

### 3. Monitor in Vercel Dashboard

- Check "Analytics" for performance
- Monitor "Logs" for errors
- Check "Deployments" history

## Troubleshooting

### Build Fails

**Error: "Cannot find module '@supabase/supabase-js'"**
- Solution: Run `pnpm install` locally first
- Check `package.json` has Supabase dependency

**Error: "Environment variable VITE_SUPABASE_URL not set"**
- Solution: Add environment variables to Vercel dashboard
- Redeploy after adding variables

### Runtime Errors

**Error: "Supabase client not initialized"**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check values are correct (no extra spaces)

**Error: "RLS policy violation"**
- Run the RLS fix migration: `scripts/01-fix-rls-policies.sql`
- Verify user is authenticated

### Network Issues

**Error: "Failed to fetch from Supabase"**
- Check internet connectivity
- Verify Supabase project is active
- Check browser network tab for CORS errors

## Performance Optimization

### Recommended Settings

1. **Caching Headers**
   - Already configured via Vercel default

2. **Image Optimization**
   - Use Vercel's Image Optimization (if using next/image)

3. **Code Splitting**
   - Vite handles automatically
   - Monitor bundle size with `pnpm build`

### Monitoring Bundle Size

```bash
# Check build output
pnpm build

# Review vite output for size information
# Aim for: < 500KB main bundle
```

## Database Backups

### Enable Automated Backups in Supabase

1. Go to Supabase Dashboard
2. Project Settings → Backups
3. Enable daily backups (recommended)

### Manual Backup

```bash
# Export database from Supabase
# Go to SQL Editor → Backups
# Or use Supabase CLI:
supabase db pull
```

## Rollback Procedures

### If Deployment Breaks

```bash
# Option 1: Revert to previous deployment
# In Vercel Dashboard → Deployments
# Click "..." on previous successful deployment
# Select "Promote to Production"

# Option 2: Redeploy from Git
vercel rollback
```

## Monitoring & Logging

### Real-time Monitoring

- Visit `/api` endpoint (if you add API routes)
- Check Vercel Analytics dashboard
- Monitor Supabase database activity

### Error Tracking

- Browser console (F12 Dev Tools)
- Vercel Logs: `vercel logs --prod`
- Supabase Studio: Logs section

## Scaling Considerations

### Current Limits

- **Supabase Free Tier**: 50GB bandwidth/month, 2GB storage
- **Vercel Free Tier**: 100GB bandwidth/month
- **Database Connections**: Up to 60 concurrent

### When to Upgrade

- Monitor Supabase dashboard for usage
- Upgrade Supabase plan at: https://supabase.com/pricing
- Upgrade Vercel at: https://vercel.com/pricing

## Security Checklist

- [ ] Environment variables are secret (not in git)
- [ ] RLS policies are correctly configured
- [ ] Supabase auth is enabled
- [ ] CORS is properly configured
- [ ] No sensitive data in client-side code
- [ ] API keys are rotated regularly

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/
- **Support**: Contact via Vercel/Supabase dashboards

## Version Information

- Node.js: 18+
- React: 19.x
- Vite: 7.x
- Supabase: 2.x
- TypeScript: 5.9+
