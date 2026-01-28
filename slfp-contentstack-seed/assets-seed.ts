import 'dotenv/config';
import * as contentstack from '@contentstack/management';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Assets Seeder for FinWise Portal
 * 
 * This script uploads assets to Contentstack:
 * 1. Branding assets (favicon, logo)
 * 2. Travel package images
 * 3. Calculator icons (if available)
 * 
 * Run this after the main seed.ts script
 */

type Env = {
  CS_API_KEY: string;
  CS_MANAGEMENT_TOKEN: string;
  CS_HOST: string;
  CS_LOCALE: string;
};

function mustGetEnv(key: keyof Env): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

const API_KEY = mustGetEnv('CS_API_KEY');
const MANAGEMENT_TOKEN = mustGetEnv('CS_MANAGEMENT_TOKEN');
const HOST = mustGetEnv('CS_HOST');
const LOCALE = process.env.CS_LOCALE || 'en-us';

const client = contentstack.client({ host: HOST });
const stack = client.stack({
  api_key: API_KEY,
  management_token: MANAGEMENT_TOKEN,
});

// Path to public assets directory (relative to project root)
const ASSETS_DIR = path.resolve(__dirname, '../public');

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Upload asset using the Management API
 * Note: Contentstack Management API asset upload requires file buffer
 */
async function uploadAssetViaAPI(
  filePath: string,
  folderPath: string = '/',
  title?: string,
  description?: string
): Promise<any> {
  const fileName = path.basename(filePath);
  const fileTitle = title || fileName.replace(/\.[^/.]+$/, '');
  const fileDescription = description || `Asset: ${fileTitle}`;
  
  console.log(`  Uploading: ${fileName}...`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    // Contentstack asset upload
    const asset = await stack.asset().create({
      asset: {
        upload: fileBuffer,
        title: fileTitle,
        description: fileDescription,
      },
    });

    console.log(`  ✅ Uploaded: ${fileTitle} (UID: ${asset.uid})`);
    
    // Publish the asset
    try {
      console.log(`  Publishing asset: ${fileTitle}...`);
      await stack.asset(asset.uid).publish();
      await sleep(200);
    } catch (publishError: any) {
      console.log(`  ⚠️  Could not publish asset (may need manual publish): ${publishError?.message || publishError}`);
    }
    
    await sleep(300); // Rate limiting
    return asset;
  } catch (error: any) {
    console.error(`  ❌ Failed to upload ${fileName}:`, error?.message || error);
    // Continue with other assets even if one fails
    return null;
  }
}


function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Check if asset exists
 */
async function assetExists(title: string): Promise<boolean> {
  try {
    const query = stack.asset().query({ query: { title } });
    const result = await query.find();
    return (result?.items?.length || 0) > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Seed branding assets
 */
async function seedBrandingAssets() {
  console.log('\n🎨 Seeding branding assets...');

  const brandingAssets = [
    {
      file: 'favicon.svg',
      folder: '/branding',
      title: 'FinWise Favicon',
      description: 'Browser favicon for FinWise portal',
    },
    {
      file: 'logo.svg',
      folder: '/branding',
      title: 'FinWise Logo',
      description: 'Main logo for FinWise - Smart Life Financial Planning',
    },
  ];

  const uploaded: Record<string, any> = {};

  for (const asset of brandingAssets) {
    const filePath = path.join(ASSETS_DIR, asset.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  File not found: ${asset.file}, skipping...`);
      continue;
    }

    const exists = await assetExists(asset.title);
    if (exists) {
      console.log(`  ℹ️  Asset already exists: ${asset.title}, skipping...`);
      continue;
    }

    try {
      const result = await uploadAssetViaAPI(filePath, asset.folder, asset.title, asset.description);
      if (result) {
        uploaded[asset.file] = result;
      }
    } catch (error) {
      console.error(`  ❌ Error uploading ${asset.file}:`, error);
    }
  }

  console.log(`✅ Uploaded ${Object.keys(uploaded).length} branding assets`);
  return uploaded;
}

/**
 * Seed travel package images
 * Note: These should be created/added manually or downloaded from stock photos
 */
async function seedTravelPackageAssets() {
  console.log('\n✈️  Seeding travel package assets...');

  const travelAssets = [
    {
      file: 'dubai-package.jpg',
      folder: '/travel-packages',
      title: 'Dubai Travel Package',
      description: 'Dubai 4D/3N travel package image',
    },
    {
      file: 'singapore-package.jpg',
      folder: '/travel-packages',
      title: 'Singapore Travel Package',
      description: 'Singapore Explorer travel package image',
    },
    {
      file: 'thailand-package.jpg',
      folder: '/travel-packages',
      title: 'Thailand Travel Package',
      description: 'Thailand Beach Bliss travel package image',
    },
  ];

  const uploaded: Record<string, any> = {};

  for (const asset of travelAssets) {
    // Try JPG first, then SVG placeholder
    let filePath = path.join(ASSETS_DIR, asset.file);
    let actualFile = asset.file;
    
    if (!fs.existsSync(filePath)) {
      // Try SVG placeholder
      const svgPath = filePath.replace('.jpg', '.svg');
      if (fs.existsSync(svgPath)) {
        filePath = svgPath;
        actualFile = asset.file.replace('.jpg', '.svg');
        console.log(`  ℹ️  Using placeholder: ${actualFile}`);
      } else {
        console.log(`  ⚠️  File not found: ${asset.file} or ${asset.file.replace('.jpg', '.svg')}`);
        console.log(`     Please add this image manually to Contentstack or create a placeholder`);
        continue;
      }
    }

    const exists = await assetExists(asset.title);
    if (exists) {
      console.log(`  ℹ️  Asset already exists: ${asset.title}, skipping...`);
      continue;
    }

    try {
      const result = await uploadAssetViaAPI(filePath, asset.folder, asset.title, asset.description);
      if (result) {
        uploaded[asset.file] = result;
      }
    } catch (error) {
      console.error(`  ❌ Error uploading ${asset.file}:`, error);
    }
  }

  console.log(`✅ Uploaded ${Object.keys(uploaded).length} travel package assets`);
  console.log(`   Note: Add travel package images manually if files don't exist`);
  return uploaded;
}

/**
 * Create placeholder images for travel packages
 * This creates simple SVG placeholders that can be replaced later
 */
async function createPlaceholderImages() {
  console.log('\n📝 Creating placeholder images...');

  const placeholders = [
    {
      file: 'dubai-package.jpg',
      title: 'Dubai Travel Package',
      color: '#FF6B35',
    },
    {
      file: 'singapore-package.jpg',
      title: 'Singapore Travel Package',
      color: '#4ECDC4',
    },
    {
      file: 'thailand-package.jpg',
      title: 'Thailand Travel Package',
      color: '#95E1D3',
    },
  ];

  for (const placeholder of placeholders) {
    const svgPath = path.join(ASSETS_DIR, placeholder.file.replace('.jpg', '.svg'));
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${placeholder.color}" opacity="0.2"/>
  <rect x="0" y="0" width="800" height="600" fill="url(#gradient)"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${placeholder.color};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${placeholder.color};stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <text x="400" y="300" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${placeholder.color}" text-anchor="middle">${placeholder.title}</text>
  <text x="400" y="340" font-family="Arial, sans-serif" font-size="18" fill="#64748b" text-anchor="middle">Placeholder Image</text>
</svg>`;

    if (!fs.existsSync(svgPath)) {
      fs.writeFileSync(svgPath, svgContent);
      console.log(`  ✅ Created placeholder: ${placeholder.file.replace('.jpg', '.svg')}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('📦 Seeding assets to Contentstack...');
  console.log('Stack:', API_KEY, 'Host:', HOST, 'Locale:', LOCALE);
  console.log('Assets directory:', ASSETS_DIR);

  // Check if assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    console.log('   Creating directory...');
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  try {
    // Create placeholder images if needed
    await createPlaceholderImages();

    // Seed assets
    const brandingAssets = await seedBrandingAssets();
    const travelAssets = await seedTravelPackageAssets();

    console.log('\n✅ Asset seeding completed!');
    console.log('\n📋 Summary:');
    console.log(`  - Branding assets: ${Object.keys(brandingAssets).length}`);
    console.log(`  - Travel package assets: ${Object.keys(travelAssets).length}`);
    console.log('\n💡 Next Steps:');
    console.log('  1. Replace placeholder images with actual travel package photos');
    console.log('  2. Upload additional assets via Contentstack UI if needed');
    console.log('  3. Organize assets in folders within Contentstack');
    console.log('  4. Link assets to content entries (travel_goal, rewards_item)');
  } catch (err: any) {
    console.error('❌ Asset seeding failed:', err?.message || err);
    if (err?.errors) console.error('Errors:', JSON.stringify(err.errors, null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
