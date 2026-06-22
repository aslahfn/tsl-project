const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir(srcDir, function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  const originalContent = fs.readFileSync(filePath, 'utf8');
  let newContent = originalContent;

  // Replace minmax(280px, 1fr) with minmax(min(280px, 100%), 1fr)
  // General regex: minmax\((\d+px),\s*1fr\) -> minmax(min($1, 100%), 1fr)
  const regex = /minmax\((\d+px),\s*1fr\)/g;

  if (regex.test(newContent)) {
    newContent = newContent.replace(regex, 'minmax(min($1, 100%), 1fr)');
  }

  if (originalContent !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    modifiedCount++;
    console.log(`Modified: ${filePath}`);
  }
});

console.log(`Grid updates complete. Modified ${modifiedCount} files.`);
