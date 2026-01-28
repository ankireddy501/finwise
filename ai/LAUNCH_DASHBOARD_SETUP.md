# Contentstack Launch Dashboard Configuration

## Critical: Manual Dashboard Configuration Required

Contentstack Launch may not automatically read configuration files. You **MUST** configure these settings manually in the dashboard.

## Step-by-Step Dashboard Configuration

### Step 1: Access Build Settings

1. Go to https://au-app.contentstack.com/
2. Click **Launch** in the left sidebar
3. Select your site
4. Click **Settings** (gear icon)
5. Click **Build Settings**

### Step 2: Configure Build Settings

Set these **exact** values:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | `18` or `22` (Launch is using v22.22.0) |
| **Root Directory** | `.` (or leave empty) |
| **Framework** | `vite` or `other` |

### Step 3: Configure Environment Variables

Go to **Settings** → **Environment Variables** and add:

```
VITE_CONTENTSTACK_API_KEY=blt0feaf330086422ec
VITE_CONTENTSTACK_DELIVERY_TOKEN=csf88973f76e5eed0e526afa80
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_HOST=au-cdn.contentstack.com
```

### Step 4: Save and Deploy

1. Click **Save** on Build Settings
2. Click **Deploy** button
3. Wait for build to complete
4. Check deployment logs

## If Still Failing

### Try These Output Directory Values (one at a time):

1. First try: `dist` (no slashes)
2. If that fails: `./dist`
3. If that fails: `dist/`
4. If that fails: `/dist`

### Verify Build Output

The build logs show these files are created:
```
dist/index.html
dist/assets/index-CZQZtN9Q.css
dist/assets/index-BjAZ2AeO.js
```

This confirms the build is working. The issue is Launch's output directory detection.

### Last Resort: Change Output Directory

If Launch absolutely cannot detect `dist`, we can change Vite's output:

1. I'll update `vite.config.ts` to output to `build` instead
2. You set Output Directory in dashboard to `build`
3. Redeploy

Let me know if you want to try this approach.

## Screenshot Checklist

Before contacting support, take screenshots of:
- [ ] Build Settings page showing Output Directory
- [ ] Environment Variables page
- [ ] Build logs showing "Build successful"
- [ ] Error message about output directory

This will help support diagnose the issue faster.
