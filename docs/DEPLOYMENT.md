# 🌐 Deployment Guide — YTMusic Player

> **Status:** Not yet deployed. `vercel.json` configured. Ready for Phase 4 deployment.
> **Last updated:** 2026-05-12

## Deploy to Vercel

### Method 1: Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

### Method 2: GitHub Integration (Recommended)

1. Push code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Every push to `main` triggers auto-deploy

### Vercel Configuration

`vercel.json`:
```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

**Key settings:**
- `maxDuration: 30` — Allows up to 30s for audio extraction (default is 10s on free tier, 30s on Pro)
- On free tier (Hobby), max is 10s — audio extraction should be fast enough

### Environment Variables on Vercel

Go to **Project Settings → Environment Variables** and add any variables from `.env.local` if needed.

## Post-Deploy Checklist

- [ ] Search works correctly
- [ ] Audio playback works
- [ ] Background playback works on mobile
- [ ] PWA install prompt appears
- [ ] Sleep timer works
- [ ] Speed control works
- [ ] Queue management works
- [ ] Language switching works

## Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your domain
3. Update DNS records as instructed by Vercel

## Performance Monitoring

Vercel provides built-in analytics:
- **Project → Analytics** tab
- Monitor serverless function execution time
- Track Web Vitals (LCP, FID, CLS)

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally first |
| API timeout | Audio extraction taking too long — check fallback chain |
| 404 on routes | Ensure `vercel.json` framework is set to `nextjs` |
| Large bundle | Use dynamic imports for non-critical components |
