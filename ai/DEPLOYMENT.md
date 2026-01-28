# Contentstack Launch Deployment Guide

This guide will help you deploy the FinWise Financial Planning Portal to Contentstack Launch.

## Prerequisites

1. A Contentstack account with access to Launch
2. Your Contentstack API credentials
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to your Git repository
2. Make sure `launch.json` is in the root directory (already created)
3. Verify `package.json` has the build script: `"build": "tsc && vite build"`

## Step 2: Set Up Environment Variables in Contentstack Launch

1. Log in to your Contentstack dashboard: https://au-app.contentstack.com/
2. Navigate to **Launch** from the left sidebar
3. Create a new site or select an existing one
4. Go to **Settings** → **Environment Variables**
5. Add the following environment variables:

   ```
   VITE_CONTENTSTACK_API_KEY=blt0feaf330086422ec
   VITE_CONTENTSTACK_DELIVERY_TOKEN=csf88973f76e5eed0e526afa80
   VITE_CONTENTSTACK_ENVIRONMENT=production
   VITE_CONTENTSTACK_HOST=au-cdn.contentstack.com
   ```

## Step 3: Connect Your Repository

1. In Launch, click **Connect Repository**
2. Select your Git provider (GitHub, GitLab, or Bitbucket)
3. Authorize Contentstack to access your repositories
4. Select the repository: `finwise`
5. Select the branch: `main` or `master`

## Step 4: Configure Build Settings

Launch will automatically detect the configuration from `launch.json`:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18
- **Framework**: vite

If you need to override these, you can do so in the Launch dashboard under **Settings** → **Build Settings**.

## Step 5: Deploy

1. Click **Deploy** in the Launch dashboard
2. Launch will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run the build command (`npm run build`)
   - Deploy the `dist` folder to a CDN
3. You'll receive a deployment URL once the build completes

## Step 6: Custom Domain (Optional)

1. In Launch, go to **Settings** → **Custom Domain**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. SSL certificate will be automatically provisioned

## Troubleshooting

### Build Fails

- Check the build logs in Launch dashboard
- Verify all environment variables are set correctly
- Ensure `package.json` has all required dependencies
- Check that TypeScript compilation passes locally: `npm run build`

### Environment Variables Not Working

- Ensure all variables are prefixed with `VITE_` (required for Vite)
- Verify variables are set in Launch dashboard under **Settings** → **Environment Variables**
- Rebuild the site after adding/updating environment variables

### Content Not Loading

- Verify your Contentstack API key and delivery token are correct
- Check that content types and entries exist in your Contentstack stack
- Verify the environment name matches (usually `production`)
- Check browser console for any API errors

## Local Testing

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

This will build and serve the production version locally at `http://localhost:4173`

## Continuous Deployment

Launch supports automatic deployments:
- **Automatic**: Deploys on every push to the connected branch
- **Manual**: Deploy only when you click the deploy button

Configure this in **Settings** → **Deployment Settings**.

## Support

For issues with Contentstack Launch, refer to:
- [Contentstack Launch Documentation](https://www.contentstack.com/docs/developers/launch/)
- [Contentstack Support](https://www.contentstack.com/support/)
