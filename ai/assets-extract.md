# Assets Extraction Guide

## Required Assets for Contentstack

### 1. Branding Assets
- ✅ `favicon.svg` - Browser favicon (64x64)
- ✅ `logo.svg` - Main logo (200x60)
- ⚠️ `logo.png` - PNG version for compatibility (recommended: 400x120)
- ⚠️ `apple-touch-icon.png` - iOS icon (180x180)

### 2. Travel Package Images
These should be uploaded to Contentstack for the Rewards page:
- `dubai-package.jpg` - Dubai 4D/3N travel package (recommended: 800x600)
- `singapore-package.jpg` - Singapore Explorer package (recommended: 800x600)
- `thailand-package.jpg` - Thailand Beach Bliss package (recommended: 800x600)

### 3. Calculator Category Icons (Optional)
If not using Lucide icons, create custom icons:
- `icon-investments.svg`
- `icon-loans.svg`
- `icon-retirement.svg`
- `icon-family.svg`
- `icon-tax.svg`
- `icon-currency.svg`
- `icon-cloud.svg`
- `icon-environment.svg`

### 4. Dashboard Illustrations (Optional)
- `dashboard-hero.svg` - Hero image for dashboard
- `financial-planning-illustration.svg` - General financial planning graphic

## Asset Organization in Contentstack

Recommended folder structure:
```
/assets
  /branding
    - favicon.svg
    - logo.svg
    - logo.png
    - apple-touch-icon.png
  /travel-packages
    - dubai-package.jpg
    - singapore-package.jpg
    - thailand-package.jpg
  /icons
    - icon-investments.svg
    - icon-loans.svg
    - ... (other icons)
  /illustrations
    - dashboard-hero.svg
    - financial-planning-illustration.svg
```

## Notes

- SVG files are preferred for logos and icons (scalable, small file size)
- JPG/PNG for photos (travel packages)
- All assets should be optimized for web (compressed)
- Recommended formats:
  - Logos: SVG or PNG (transparent background)
  - Photos: JPG (compressed, 80-90% quality)
  - Icons: SVG or PNG (transparent background)
