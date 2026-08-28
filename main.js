const fs = require('fs');
const path = require('path');

// Get the current directory path (the repo root)
const repoRoot = process.cwd();

// Function to read a directory recursively
function readDirRecursive(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    let result = {};

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            // Recurse into subdirectory
            const subResult = readDirRecursive(fullPath);
            result[file.name] = subResult;
        } else if (file.isFile()) {
            // Read file content
            let content;
            try {
                content = fs.readFileSync(fullPath, 'utf8');
            } catch (err) {
                content = '';
            }
            result[file.name] = content;
        }
    }

    return result;
}

// Read the whole repository
const repoFiles = readDirRecursive(repoRoot);

// Print a tree or find main.js specifically
function printTree(node, indent = '') {
    if (typeof node === 'string') {
        console.log(indent + 'FILE: ' + node);
    } else {
        for (const [key, value] of Object.entries(node)) {
            console.log(indent + 'DIR: ' + key);
            if (typeof value === 'string') {
                console.log(indent + '  FILE: ' + key);
            } else {
                printTree(value, indent + '  ');
            }
        }
    }
}
printTree(repoFiles);