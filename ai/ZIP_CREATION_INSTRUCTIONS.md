# ZIP File Creation Instructions

## Issue
The automated ZIP creation script is encountering permission issues. Please create the ZIP file manually using one of the methods below.

## Method 1: Using Finder (macOS) - Recommended

1. **Open Finder** and navigate to:
   ```
   /Users/ankireddy.polu/contentstack/finwise
   ```

2. **Select all files and folders** (Cmd+A)

3. **Deselect/Exclude** these items:
   - `node_modules` folder
   - `.git` folder (if visible)
   - `build` folder
   - `dist` folder
   - Any existing `.zip` files
   - `slfp-contentstack-seed/node_modules`
   - `.DS_Store` files

4. **Right-click** on selected items → **Compress Items**

5. **Rename** the created `Archive.zip` to: `finwise-launch-complete.zip`

## Method 2: Using Terminal (Alternative)

If you have write permissions in a different location:

```bash
# Navigate to parent directory
cd /Users/ankireddy.polu/contentstack

# Create ZIP excluding unnecessary files
zip -r finwise-launch-complete.zip finwise \
  -x "finwise/node_modules/*" \
  -x "finwise/.git/*" \
  -x "finwise/build/*" \
  -x "finwise/dist/*" \
  -x "finwise/*.zip" \
  -x "finwise/.DS_Store" \
  -x "finwise/slfp-contentstack-seed/node_modules/*" \
  -x "finwise/slfp-contentstack-seed/.env" \
  -x "finwise/*.log"
```

## Method 3: Using Archive Utility (macOS)

1. Select all project files (excluding node_modules, build, dist)
2. Right-click → **Open With** → **Archive Utility**
3. Rename the created archive

## What to Include in ZIP

### ✅ Must Include:
- `src/` - All source code
- `public/` - Assets (favicon, logo, images)
- `slfp-contentstack-seed/` - Seed scripts (except .env and node_modules)
- Configuration files:
  - `package.json`
  - `package-lock.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `tsconfig.node.json`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `launch.json`
  - `index.html`
  - `.gitignore`
  - `.env.example`
- Documentation files (`.md`)

### ❌ Must Exclude:
- `node_modules/` - Will be installed during build
- `.git/` - Version control (not needed)
- `build/` - Will be generated
- `dist/` - Will be generated
- `*.zip` - Existing zip files
- `.env` - Sensitive (use `.env.example`)
- `slfp-contentstack-seed/.env` - Sensitive
- `slfp-contentstack-seed/node_modules/` - Will be installed
- `*.log` - Log files
- `.DS_Store` - macOS system files

## Expected ZIP Size

**2-5 MB** (without node_modules)

If your ZIP is larger than 10 MB, you likely included `node_modules` - exclude it!

## Upload to Contentstack Launch

1. Go to **Contentstack Launch** dashboard
2. Navigate to your site
3. Click **Upload ZIP** or **Deploy from ZIP**
4. Select `finwise-launch-complete.zip`
5. Launch will:
   - Extract files
   - Run `npm install`
   - Run `npm run build`
   - Deploy from `build/` directory

## Verification Checklist

Before uploading, verify your ZIP contains:
- [ ] `package.json` in root
- [ ] `launch.json` in root
- [ ] `vite.config.ts` in root
- [ ] `src/` directory with all source files
- [ ] `public/` directory with assets
- [ ] `index.html` in root
- [ ] No `node_modules/` folder
- [ ] No `build/` or `dist/` folders
- [ ] No `.env` files (only `.env.example`)

## Quick Reference

**ZIP File Name:** `finwise-launch-complete.zip`

**Location to create:** Anywhere you have write permissions (Desktop, Documents, etc.)

**Upload to:** Contentstack Launch dashboard

---

**Note:** If you continue to have permission issues, try creating the ZIP in a different location (like Desktop) and then move it to the project folder if needed.
