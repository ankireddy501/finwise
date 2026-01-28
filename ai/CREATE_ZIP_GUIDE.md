# Create ZIP File for Contentstack Launch

## Quick Method

Run the npm script:
```bash
npm run zip
```

This will create a timestamped ZIP file: `finwise-launch-YYYYMMDD.zip`

## Manual Method

If the script doesn't work due to permissions, create the ZIP manually:

### Option 1: Using Terminal (macOS/Linux)

```bash
cd /Users/ankireddy.polu/contentstack/finwise
zip -r finwise-launch-complete.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "build/*" \
  -x "dist/*" \
  -x "*.zip" \
  -x ".DS_Store" \
  -x "slfp-contentstack-seed/node_modules/*" \
  -x "slfp-contentstack-seed/.env" \
  -x "*.log"
```

### Option 2: Using Finder (macOS)

1. Open Finder and navigate to the project folder
2. Select all files and folders **EXCEPT**:
   - `node_modules`
   - `.git`
   - `build`
   - `dist`
   - Any existing `.zip` files
   - `slfp-contentstack-seed/node_modules`
   - `slfp-contentstack-seed/.env`
3. Right-click → **Compress Items**
4. Rename to: `finwise-launch-complete.zip`

### Option 3: Using File Manager (Windows/Linux)

1. Navigate to project folder
2. Select all files/folders (Ctrl+A / Cmd+A)
3. Exclude:
   - `node_modules`
   - `.git`
   - `build`
   - `dist`
   - Existing zip files
4. Right-click → **Send to** → **Compressed (zipped) folder**
5. Rename to: `finwise-launch-complete.zip`

## What to Include

✅ **Include:**
- All source code (`src/`)
- Configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`, etc.)
- Public assets (`public/`)
- Seed scripts (`slfp-contentstack-seed/`)
- Documentation files (`.md`)
- `launch.json`
- `index.html`
- `.gitignore`
- `.env.example`

❌ **Exclude:**
- `node_modules/` (will be installed during build)
- `.git/` (version control, not needed)
- `build/` (will be generated)
- `dist/` (will be generated)
- `*.zip` (existing zip files)
- `.env` (sensitive, use `.env.example`)
- `slfp-contentstack-seed/.env` (sensitive)
- `*.log` (log files)
- `.DS_Store` (macOS system files)

## ZIP File Size

Expected size: **2-5 MB** (without node_modules)

If the ZIP is larger than 10 MB, you likely included `node_modules` - exclude it!

## Upload to Contentstack Launch

1. Go to Contentstack Launch dashboard
2. Navigate to your site
3. Click **Upload ZIP** or **Deploy from ZIP**
4. Select the created ZIP file
5. Launch will:
   - Extract the files
   - Run `npm install`
   - Run `npm run build`
   - Deploy the `build/` directory

## Troubleshooting

### Permission Denied
- Try running from a different directory
- Check file permissions
- Use manual method instead

### ZIP Too Large
- Ensure `node_modules` is excluded
- Check for large build artifacts
- Exclude unnecessary documentation files if needed

### Missing Files
- Verify all source files are included
- Check that `package.json` is included
- Ensure `launch.json` is in the root

---

**Ready to deploy!** Once the ZIP is created, upload it to Contentstack Launch.
