const path = require('path');
const fs = require('fs');

// List files in the repository root
const rootDir = __dirname;
const entries = fs.readdirSync(rootDir, { withFileTypes: true });

// Recursively list all files
function listFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      listFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = listFiles(rootDir);

// Print out interesting files (excluding node_modules, .git, etc.)
const interestingFiles = allFiles.filter(f => {
  const normalized = f.toLowerCase();
  return !normalized.includes('node_modules') && !normalized.includes('.git') && !normalized.includes('coverage') && !normalized.includes('.DS_Store');
});

console.log('Repository files:');
interestingFiles.forEach(f => console.log(f));