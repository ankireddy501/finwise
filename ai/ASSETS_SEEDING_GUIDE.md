# Assets Seeding Guide for Contentstack

## Overview

This guide explains how to extract and upload assets (images, logos, icons) to Contentstack for the FinWise Financial Planning Portal.

## Assets Script

A new script `assets-seed.ts` has been created to automatically upload assets to Contentstack.

## Required Assets

### 1. Branding Assets (Created)
- ✅ `favicon.svg` - Browser favicon
- ✅ `logo.svg` - Main FinWise logo

### 2. Travel Package Images (Placeholders Created)
- ⚠️ `dubai-package.svg` - Placeholder (replace with actual photo)
- ⚠️ `singapore-package.svg` - Placeholder (replace with actual photo)
- ⚠️ `thailand-package.svg` - Placeholder (replace with actual photo)

### 3. Optional Assets
- Calculator category icons (if not using Lucide icons)
- Dashboard illustrations
- Financial planning graphics

## Running the Assets Seed Script

### Prerequisites

1. Ensure `.env` file exists in `slfp-contentstack-seed/`:
```env
CS_API_KEY=blt0feaf330086422ec
CS_MANAGEMENT_TOKEN=your_management_token
CS_HOST=au-api.contentstack.com
CS_LOCALE=en-us
```

2. Ensure assets exist in `public/` directory:
   - `favicon.svg` ✅
   - `logo.svg` ✅
   - Travel package images (or placeholders)

### Run the Script

```bash
cd slfp-contentstack-seed
npm run seed:assets
```

Or directly:
```bash
npx tsx assets-seed.ts
```

### Run All Seed Scripts

To seed everything (content types, entries, and assets):
```bash
npm run seed:all
```

## What the Script Does

1. **Creates Placeholder Images**: Generates SVG placeholders for travel packages if images don't exist
2. **Uploads Branding Assets**: Uploads favicon and logo to Contentstack
3. **Uploads Travel Package Assets**: Uploads travel package images (or placeholders)
4. **Organizes Assets**: Attempts to organize assets in folders (may require manual organization)

## Asset Organization in Contentstack

After running the script, organize assets in Contentstack UI:

### Recommended Folder Structure:
```
/assets
  /branding
    - favicon.svg
    - logo.svg
  /travel-packages
    - dubai-package.jpg (or .svg placeholder)
    - singapore-package.jpg (or .svg placeholder)
    - thailand-package.jpg (or .svg placeholder)
  /icons (optional)
    - icon-investments.svg
    - icon-loans.svg
    - ...
  /illustrations (optional)
    - dashboard-hero.svg
    - ...
```

## Manual Asset Upload

If the script fails or you prefer manual upload:

1. **Go to Contentstack Dashboard**:
   - Navigate to **Assets** section
   - Click **Upload** or drag & drop files

2. **Create Folders**:
   - Click **New Folder**
   - Create: `branding`, `travel-packages`, etc.

3. **Upload Files**:
   - Select files from `public/` directory
   - Add titles and descriptions
   - Organize into folders

4. **Link to Content**:
   - Edit content entries (e.g., `travel_goal`, `rewards_item`)
   - Add asset references where needed

## Linking Assets to Content

### Travel Goals
Update `travel_goal` entries to reference travel package images:

```typescript
{
  name: "Dubai 4D/3N",
  image: { uid: "asset_uid_here", _content_type_uid: "asset" },
  // ... other fields
}
```

### Rewards Items
Update `rewards_item` entries to reference images:

```typescript
{
  name: "Dubai 4D/3N",
  image: { uid: "asset_uid_here", _content_type_uid: "asset" },
  // ... other fields
}
```

## Content Type Updates Needed

To properly link assets, you may need to add asset fields to content types:

### Travel Goal Content Type
Add field:
- `image` (asset, single) - Travel package image

### Rewards Item Content Type
Add field:
- `image` (asset, single) - Reward item image

### Dashboard Card Content Type
Add field:
- `icon_image` (asset, single, optional) - Custom icon image

## Replacing Placeholder Images

1. **Get Real Images**:
   - Use stock photos (Unsplash, Pexels)
   - Or create custom illustrations
   - Recommended size: 800x600px for travel packages

2. **Optimize Images**:
   - Compress JPGs (80-90% quality)
   - Optimize SVGs
   - Use WebP for better compression

3. **Upload to Contentstack**:
   - Replace placeholder assets
   - Or upload new assets and update references

## Troubleshooting

### Script Fails to Upload
- Check file paths are correct
- Verify files exist in `public/` directory
- Check Management Token has asset upload permissions
- Review error messages for specific issues

### Assets Not Showing
- Verify assets are published in Contentstack
- Check asset UIDs are correct in content entries
- Ensure delivery token has access to assets

### Folder Organization
- Script may not create folders automatically
- Manually create folders in Contentstack UI
- Move assets to appropriate folders

## Best Practices

1. **File Naming**: Use descriptive, consistent names
   - `finwise-logo.svg` not `logo1.svg`
   - `dubai-travel-package.jpg` not `img1.jpg`

2. **File Formats**:
   - Logos/Icons: SVG (scalable) or PNG (with transparency)
   - Photos: JPG (compressed) or WebP (modern)
   - Avoid: GIF (unless animated), BMP, TIFF

3. **File Sizes**:
   - Logos: < 50KB
   - Icons: < 10KB
   - Photos: < 500KB (optimized)
   - Always compress before uploading

4. **Alt Text**: Add descriptions to all assets for accessibility

5. **Version Control**: Keep original high-resolution files locally

## Script Output Example

```
📦 Seeding assets to Contentstack...
Stack: blt0feaf330086422ec Host: au-api.contentstack.com Locale: en-us

📝 Creating placeholder images...
  ✅ Created placeholder: dubai-package.svg
  ✅ Created placeholder: singapore-package.svg
  ✅ Created placeholder: thailand-package.svg

🎨 Seeding branding assets...
  Uploading: favicon.svg...
  ✅ Uploaded: FinWise Favicon (UID: blt123...)
  Uploading: logo.svg...
  ✅ Uploaded: FinWise Logo (UID: blt456...)
✅ Uploaded 2 branding assets

✈️  Seeding travel package assets...
  ⚠️  File not found: dubai-package.jpg
     Please add this image manually to Contentstack or create a placeholder
  ⚠️  File not found: singapore-package.jpg
  ⚠️  File not found: thailand-package.jpg
✅ Uploaded 0 travel package assets
   Note: Add travel package images manually if files don't exist

✅ Asset seeding completed!

📋 Summary:
  - Branding assets: 2
  - Travel package assets: 0

💡 Next Steps:
  1. Replace placeholder images with actual travel package photos
  2. Upload additional assets via Contentstack UI if needed
  3. Organize assets in folders within Contentstack
  4. Link assets to content entries (travel_goal, rewards_item)
```

## Next Steps

1. ✅ Run `npm run seed:assets` to upload existing assets
2. ⚠️ Add travel package images (replace placeholders)
3. ⚠️ Update content types to include asset fields
4. ⚠️ Link assets to content entries
5. ⚠️ Test asset display in frontend

---

**Status**: Assets seeding script is ready. Branding assets (favicon, logo) will be uploaded automatically. Travel package images need to be added manually or replaced with actual photos.
