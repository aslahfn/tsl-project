const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const dirs = ['logos', 'news', 'sponsors', 'gallery', 'players'];

// Ensure directories exist
dirs.forEach(d => {
  const p = path.join(publicDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

function createLogoSvg(shortName, color, bgColor = '#1a1a24') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad-${shortName}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#050508;stop-opacity:1" />
    </linearGradient>
    <filter id="glow-${shortName}">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#grad-${shortName})" stroke="${color}" stroke-width="4"/>
  <path d="M 50,150 L 100,60 L 150,150" fill="none" stroke="${color}" stroke-width="8" opacity="0.2"/>
  <circle cx="100" cy="100" r="75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="4,4" opacity="0.5"/>
  <text x="100" y="115" font-family="Arial, sans-serif" font-weight="900" font-size="48" fill="${color}" text-anchor="middle" filter="url(#glow-${shortName})">${shortName}</text>
</svg>`;
}

function createGenericSvg(text, bgColor, textColor = '#ffffff', width = 800, height = 400) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="#ffffff" stroke-opacity="0.05" stroke-width="2"/>
  <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="#ffffff" stroke-opacity="0.05" stroke-width="2"/>
  <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-weight="bold" font-size="${height/10}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

function createSponsorSvg(text, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
  <rect width="100%" height="100%" fill="#0a0a0f" rx="10"/>
  <rect width="100%" height="100%" fill="none" stroke="${color}" stroke-width="2" rx="10" stroke-opacity="0.5"/>
  <text x="150" y="55" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

const teams = [
  { short: 'LSF', color: '#3498db' },
  { short: 'FCF', color: '#9b59b6' },
  { short: 'KKF', color: '#e67e22' },
  { short: 'KMF', color: '#2ecc71' },
  { short: 'MDF', color: '#e74c3c' }
];

// Write team logos
teams.forEach(t => {
  fs.writeFileSync(path.join(publicDir, 'logos', `${t.short.toLowerCase()}.svg`), createLogoSvg(t.short, t.color));
});

// Write default logo
fs.writeFileSync(path.join(publicDir, 'logos', 'default.svg'), createLogoSvg('TSL', '#FFD700'));

// Write news images
fs.writeFileSync(path.join(publicDir, 'news', 'n1.jpg'), createGenericSvg('MATCH REPORT', '#1a1a24', '#FFD700', 800, 400));
fs.writeFileSync(path.join(publicDir, 'news', 'n2.jpg'), createGenericSvg('TRANSFER NEWS', '#1a1a24', '#FFD700', 800, 400));
fs.writeFileSync(path.join(publicDir, 'news', 'n3.jpg'), createGenericSvg('FEATURED INTERVIEW', '#1a1a24', '#FFD700', 800, 400));
fs.writeFileSync(path.join(publicDir, 'placeholder-news.jpg'), createGenericSvg('NEWS', '#0a0a0f', '#555555', 800, 400));

// Write sponsors
for (let i = 1; i <= 6; i++) {
  fs.writeFileSync(path.join(publicDir, 'sponsors', `s${i}.svg`), createSponsorSvg(`SPONSOR ${i}`, '#FFD700'));
}
fs.writeFileSync(path.join(publicDir, 'placeholder-sponsor.png'), createSponsorSvg('YOUR BRAND HERE', '#555555'));

// Write player placeholders
fs.writeFileSync(path.join(publicDir, 'placeholder-player.png'), createGenericSvg('PLAYER', '#0a0a0f', '#333333', 300, 400));

console.log("Generated SVG placeholders successfully!");
