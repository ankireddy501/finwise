// Verification script to ensure build directory exists after build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, 'build');

if (!fs.existsSync(buildPath)) {
  console.error('ERROR: build directory not found after build');
  process.exit(1);
}

const files = fs.readdirSync(buildPath);
console.log('✓ build directory exists');
console.log('✓ Files in build:', files.join(', '));

// Verify index.html exists
const indexPath = path.join(buildPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found in build directory');
  process.exit(1);
}
console.log('✓ index.html verified');

// Create a marker file for Launch
fs.writeFileSync(path.join(buildPath, '.contentstack-deploy'), 'ready');
console.log('✓ Created deployment marker file');
