#!/usr/bin/env node

/**
 * Create ZIP file for Contentstack Launch deployment
 * Excludes node_modules, build artifacts, and other unnecessary files
 * Run in your terminal: npm run zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = __dirname;
const zipFileName = `finwise-launch-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.zip`;
const zipPath = path.join(projectRoot, zipFileName);

// Files and directories to exclude
const excludes = [
  'node_modules',
  '.git',
  'build',
  'dist',
  '.DS_Store',
  '*.zip',
  '*.log',
  'slfp-contentstack-seed/node_modules',
  'slfp-contentstack-seed/.env',
  '.env',
  '.vscode',
  'coverage',
];

console.log('📦 Creating ZIP file for Contentstack Launch...');
console.log(`Output: ${zipFileName}`);

try {
  // Build exclude string for zip command
  const excludeArgs = excludes.map(exclude => `-x "${exclude}/*"`).join(' ');
  
  // Create zip file
  const command = `cd "${projectRoot}" && zip -r "${zipFileName}" . ${excludeArgs} -x "*.zip"`;
  
  console.log('Running zip command...');
  execSync(command, { stdio: 'inherit' });
  
  // Check if file was created
  if (fs.existsSync(zipPath)) {
    const stats = fs.statSync(zipPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ ZIP file created successfully!`);
    console.log(`   File: ${zipFileName}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`   Location: ${zipPath}`);
    console.log(`\n📤 Ready to upload to Contentstack Launch!`);
  } else {
    console.error('❌ ZIP file was not created');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error creating ZIP file:', error.message);
  console.log('\n💡 Alternative: Create ZIP manually:');
  console.log('   1. Open Terminal and run: cd ' + projectRoot + ' && npm run zip');
  console.log('   2. Or select all files (except node_modules, build, dist, .git) → Right-click → Compress');
  console.log('   3. Name it: finwise-launch-complete.zip');
  process.exit(1);
}
