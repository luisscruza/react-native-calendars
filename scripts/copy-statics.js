const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../src');
const dest = path.resolve(__dirname, '../dist');

function copyRecursiveSync(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  const stats = fs.statSync(srcDir);

  if (stats.isDirectory()) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(child => {
      const srcPath = path.join(srcDir, child);
      const destPath = path.join(destDir, child);
      copyRecursiveSync(srcPath, destPath);
    });
  } else {
    // skip .ts and .tsx files (already compiled by tsc)
    if (!srcDir.match(/\.(ts|tsx)$/)) {
      fs.copyFileSync(srcDir, destDir);
      console.log(`✓ Copied: ${srcDir.replace(src + '/', '')}`);
    }
  }
}

copyRecursiveSync(src, dest);
