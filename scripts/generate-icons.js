#!/usr/bin/env node
// Run: node scripts/generate-icons.js
// Generates PWA icons — run once after npm install

const fs = require('fs');
const path = require('path');

// Simple SVG icon with Vietnamese flag colors
const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#DA251D"/>
  <polygon points="${size/2},${size*0.2} ${size*0.58},${size*0.44} ${size*0.85},${size*0.44} ${size*0.63},${size*0.59} ${size*0.71},${size*0.83} ${size/2},${size*0.68} ${size*0.29},${size*0.83} ${size*0.37},${size*0.59} ${size*0.15},${size*0.44} ${size*0.42},${size*0.44}" fill="#FFFF00"/>
  <text x="${size/2}" y="${size*0.97}" text-anchor="middle" font-family="Arial" font-size="${size*0.12}" fill="#C8A84B" font-weight="bold">₫ CAD</text>
</svg>`;

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Write SVG icons (browsers accept SVG for PWA icons in some cases)
// For production, convert these to PNG using sharp or imagemagick
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svgIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svgIcon(512));

console.log('SVG icons generated. Convert to PNG for full PWA support:');
console.log('  npx sharp-cli --input public/icons/icon-192.svg --output public/icons/icon-192.png');
console.log('  npx sharp-cli --input public/icons/icon-512.svg --output public/icons/icon-512.png');
