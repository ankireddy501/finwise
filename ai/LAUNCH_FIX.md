# Fix Contentstack Launch Output Directory Error

The build is successful, but Launch can't find the output directory. Here's how to fix it:

## Solution: Configure Output Directory in Launch Dashboard

Since you uploaded via ZIP, you need to manually configure the build settings in the Launch dashboard:

### Step 1: Go to Launch Settings

1. Log in to https://au-app.contentstack.com/
2. Navigate to **Launch**
3. Select your site
4. Go to **Settings** → **Build Settings**

### Step 2: Update Build Settings

Set the following values:

- **Build Command**: `npm run build`
- **Output Directory**: `dist` (or `./dist`)
- **Install Command**: `npm install`
- **Node Version**: `18` or `22` (Launch is using v22.22.0)
- **Root Directory**: `.` (leave empty or set to current directory)

### Step 3: Verify Environment Variables

Go to **Settings** → **Environment Variables** and ensure these are set:

```
VITE_CONTENTSTACK_API_KEY=blt0feaf330086422ec
VITE_CONTENTSTACK_DELIVERY_TOKEN=csf88973f76e5eed0e526afa80
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_HOST=au-cdn.contentstack.com
```

### Step 4: Redeploy

After updating the settings, click **Deploy** again.

## Alternative: Update launch.json Format

If Launch still doesn't recognize the output directory, try this format in `launch.json`:

```json
{
  "build": {
    "command": "npm run build",
    "output": "dist"
  },
  "install": {
    "command": "npm install"
  }
}
```

## Verification

After deployment, check that:
1. Build completes successfully (✓ built in X.XXs)
2. No "Incorrect output directory" error
3. Site is accessible via the provided URL

## If Issues Persist

1. Check the build logs to confirm `dist/` folder is created
2. Try setting output directory to `./dist` or `/dist`
3. Contact Contentstack support with the build logs
