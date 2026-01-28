# Contentstack Launch Output Directory Fix

## The Problem
Build succeeds but Launch can't find the output directory. The build creates files in `dist/` but Launch reports "Incorrect output directory specified".

## Solutions to Try (in order)

### Solution 1: Dashboard Settings (Most Important)

In Contentstack Launch Dashboard:

1. Go to **Settings** → **Build Settings**
2. Set **Output Directory** to exactly: `dist` (no slash, no dot)
3. **DO NOT** use `./dist` or `/dist` or `dist/`
4. Set **Root Directory** to: `.` (or leave empty)
5. Save and redeploy

### Solution 2: Try Different Output Directory Values

If `dist` doesn't work, try these one at a time:
- `./dist`
- `/dist` 
- `dist/`
- `.dist` (unlikely but some platforms need this)

### Solution 3: Check Build Logs Location

The build logs show files are created at:
- `dist/index.html`
- `dist/assets/index-CZQZtN9Q.css`
- `dist/assets/index-BjAZ2AeO.js`

This confirms the output is in `dist/`. The issue is Launch's detection.

### Solution 4: Contact Contentstack Support

If the above don't work, contact Contentstack support with:
1. Build logs showing successful build
2. Confirmation that `dist/` folder exists after build
3. Screenshot of your Build Settings in Launch dashboard

### Solution 5: Alternative - Use Different Output Directory

If Launch has issues with `dist`, we can change Vite's output:

1. Update `vite.config.ts` to use `build` instead of `dist`
2. Update Launch dashboard Output Directory to `build`
3. Redeploy

## Verification Steps

After setting Output Directory in dashboard:

1. Check build logs - should show "Build successful"
2. Check for "Incorrect output directory" error - should be gone
3. Site should be accessible via Launch URL

## Current Configuration Files

We've created multiple config files:
- `launch.json` - Standard Launch config
- `.contentstack.json` - Alternative Contentstack config
- `vite.config.ts` - Explicitly sets `outDir: 'dist'`

The dashboard settings override these files, so **Solution 1 is critical**.
