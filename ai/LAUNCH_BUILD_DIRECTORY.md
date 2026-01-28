# Contentstack Launch - Build Directory Fix

## Important Change

I've changed the output directory from `dist` to `build` because:
1. `build` is a more standard name that many hosting platforms recognize
2. Contentstack Launch may have better support for `build` directory
3. The verification script confirms the directory is created correctly

## Configuration Updates

All configuration files have been updated to use `build`:
- ✅ `vite.config.ts` - Outputs to `build/`
- ✅ `launch.json` - Output directory set to `build`
- ✅ `.contentstack.json` - Output set to `build`
- ✅ `verify-build.js` - Verifies `build/` directory

## Launch Dashboard Configuration

**CRITICAL**: Update your Launch dashboard settings:

1. Go to **Launch** → **Settings** → **Build Settings**
2. Set **Output Directory** to: `build` (exactly, no slashes, lowercase)
3. Verify other settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Node Version: `22` (or `18`)
4. **Save** and **Redeploy**

## Build Verification

The build script now includes verification that:
- ✅ Build directory exists
- ✅ index.html is present
- ✅ Creates deployment marker file

Build logs will show:
```
✓ build directory exists
✓ Files in build: assets, index.html
✓ index.html verified
✓ Created deployment marker file
```

## If `build` Still Doesn't Work

Try these output directory values in the dashboard (one at a time):
1. `build` (current)
2. `./build`
3. `build/`
4. `/build`

## Alternative: Output to Root

If Launch absolutely cannot detect subdirectories, we can modify the build to output directly to root. Let me know if you want to try this approach.

## Current Status

✅ Build outputs to `build/` directory
✅ Verification script confirms output exists
✅ All configuration files updated
⏳ Waiting for Launch dashboard configuration update
