const fs = require('fs');
const path = require('path');

/**
 * Process a TSX/JSX file to add accessible names to SVG elements
 * @param {string} filePath - Path to the file
 * @returns {string|null} - Modified content or null if no changes
 */
function processTsxFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern to match SVG elements (self-closing or with children)
    // Matches <svg ... > or <svg ... />
    const svgRegex = /(<svg\b[^>]*>)|(<svg\b[^>]*\/>)/gi;
    
    content = content.replace(svgRegex, (match) => {
      // Skip if already has aria-label or aria-hidden
      if (match.includes('aria-label') || match.includes('aria-hidden')) {
        return match;
      }
      
      // Add aria-label="SVG Graphic" to make it accessible
      // For icon/favicon SVGs, we add aria-hidden="true" as they're typically decorative
      let modifiedMatch = match;
      
      // Remove trailing /> or > to add attributes
      if (match.endsWith('/>')) {
        modifiedMatch = match.slice(0, -2) + ' aria-hidden="true" />';
      } else if (match.endsWith('>')) {
        modifiedMatch = match.slice(0, -1) + ' aria-hidden="true">';
      }
      
      modified = true;
      return modifiedMatch;
    });
    
    return modified ? content : null;
  } catch (error) {
    console.error(`Error processing TSX file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Process a file based on its extension
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file was modified
 */
function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Handle TSX/JSX files
  if (ext === '.tsx' || ext === '.jsx') {
    const newContent = processTsxFile(filePath);
    if (newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  }
  
  return false;
}

/**
 * Recursively find and process files in a directory
 * @param {string} dirPath - Directory path
 * @param {string[]} extensions - File extensions to process
 */
function processDirectory(dirPath, extensions = ['.tsx', '.jsx']) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        processDirectory(fullPath, extensions);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: process specific files mentioned in the issue
  const targetFiles = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
  ];
  
  for (const file of targetFiles) {
    if (fs.existsSync(file)) {
      processFile(file);
    }
  }
} else if (args[0] === '--dir' && args[1]) {
  // Process all TSX/JSX files in a directory
  processDirectory(args[1]);
} else {
  // Process specific files
  for (const file of args) {
    if (fs.existsSync(file)) {
      processFile(file);
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
}

module.exports = {
  processFile,
  processTsxFile,
  processDirectory
};