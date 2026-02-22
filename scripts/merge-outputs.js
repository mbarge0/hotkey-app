#!/usr/bin/env node

/**
 * Merge outputs for unified deployment
 * 
 * Structure:
 * - apps/landing/* (static HTML) → public/*
 * - apps/review/out/* → public/review/*
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LANDING_SRC = path.join(ROOT, 'apps/landing');
const REVIEW_OUT = path.join(ROOT, 'apps/review/out');

// Clean public directory
if (fs.existsSync(PUBLIC)) {
  fs.rmSync(PUBLIC, { recursive: true, force: true });
}
fs.mkdirSync(PUBLIC, { recursive: true });

console.log('🔄 Merging build outputs...\n');

// Copy landing page files (HTML, CSS, images)
console.log('📄 Copying landing page → /');
const landingFiles = ['index.html', 'favicon.svg'];
for (const file of landingFiles) {
  const src = path.join(LANDING_SRC, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(PUBLIC, file));
    console.log(`   ✓ ${file}`);
  }
}

// Copy review to /review
console.log('📊 Copying review UI → /review');
const reviewDest = path.join(PUBLIC, 'review');
fs.mkdirSync(reviewDest, { recursive: true });
copyRecursive(REVIEW_OUT, reviewDest);

// Copy review's batch.json to /review/batch.json
const batchSrc = path.join(REVIEW_OUT, 'batch.json');
const batchDest = path.join(reviewDest, 'batch.json');
if (fs.existsSync(batchSrc)) {
  fs.copyFileSync(batchSrc, batchDest);
  console.log('   ✓ batch.json');
}

console.log('\n✅ Merge complete!\n');
console.log('Deploy directory: public/');
console.log('  / → Landing page');
console.log('  /review → Review UI');

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
