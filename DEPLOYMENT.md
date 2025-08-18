# Deploying Cast Scheduler Pro to Vercel

This guide will help you deploy your Farcaster cast scheduler to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (free at [vercel.com](https://vercel.com))
- Your Supabase project credentials

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit: Farcaster Cast Scheduler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_KEY=your_supabase_anon_key_here
```

## Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. You'll get a URL like: `https://your-project.vercel.app`

## Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update your Farcaster Frame in `public/frame.html` with your domain

## Environment Variables

Make sure to set these in your Vercel dashboard:

- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_KEY` - Your Supabase anon/public key

## What's Included

Your deployed app will have:

- ✅ **Dashboard** - Overview of scheduled casts
- ✅ **Scheduler** - Create and schedule new casts
- ✅ **Queue** - Manage your cast queue with simple up/down arrows
- ✅ **Team** - Team collaboration (placeholder for future features)
- ✅ **Settings** - User settings

## Features

- **Cast Scheduling** - Schedule Farcaster casts up to 30 days ahead
- **Bulk Upload** - Import casts via CSV
- **Queue Management** - Simple reordering with arrow buttons
- **Modern UI** - Built with React and Tailwind CSS
- **Responsive Design** - Works on all devices

## Support

If you encounter issues:

1. Check the Vercel build logs
2. Verify environment variables are set correctly
3. Ensure your Supabase project is accessible

## Next Steps

After deployment, you can:

1. Connect your Farcaster account
2. Set up automated posting
3. Add team collaboration features
4. Implement analytics and reporting

---

**Your Farcaster Cast Scheduler is now live! 🎉**
