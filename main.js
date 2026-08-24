const fs = require('fs');
const path = require('path');

function findJsxFiles(dir, files = []) {
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
                findJsxFiles(fullPath, files);
            } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.tsx'))) {
                files.push(fullPath);
            }
        }
    } catch (e) {
        // Ignore permission errors
    }
    return files;
}

const jsxFiles = findJsxFiles('.');
console.log('Found JSX/TSX files:');
jsxFiles.forEach(f => console.log(f));