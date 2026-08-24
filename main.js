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
    const svgRegex = /<svg(?:\s[^>]*)?(?:\/>|>)/gi;
    
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
 * Process a TSX/JSX file to fix multiple <main> landmark issues (REACT_025)
 * Converts additional <main> elements to <section> elements for accessibility compliance
 * @param {string} filePath - Path to the file
 * @returns {string|null} - Modified content or null if no changes
 */
function processMainLandmarks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Find all <main> elements (both self-closing and with content)
    // Pattern to match <main ... > or <main ... />
    const mainRegex = /<main(?:\s[^>]*)?(?:\/>|>[\s\S]*?<\/main>)/gi;
    
    let mainCount = 0;
    const replacements = [];
    
    // First pass: count and collect all <main> elements
    let match;
    const regex = /<main(?:\s[^>]*)?(?:\/>|>[\s\S]*?<\/main>)/gi;
    
    while ((match = regex.exec(content)) !== null) {
      mainCount++;
      if (mainCount > 1) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          content: content.substring(match.index, match.index + match[0].length)
        });
      }
    }
    
    if (mainCount <= 1) {
      return null; // No issue - only one or no <main> landmark
    }
    
    // Second pass: replace additional <main> elements with <section>
    // Process from end to beginning to preserve indices
    for (let i = replacements.length - 1; i >= 0; i--) {
      const replacement = replacements[i];
      let newContent = replacement.content;
      
      // Replace opening <main> tags with <section>
      newContent = newContent.replace(/<main(?:\s[^>]*)?>/i, (match, attrs) => {
        const sectionAttrs = attrs ? attrs.replace(/role\s*=\s*["'][^"']*["']/i, '').trim() : '';
        return sectionAttrs ? `<section${sectionAttrs}>` : '<section>';
      });
      
      // Replace closing </main> tags with </section>
      newContent = newContent.replace(/<\/main>/gi, '</section>');
      
      // Replace self-closing <main /> with <section />
      newContent = newContent.replace(/<main\s*\/>/i, '<section/>');
      
      // Remove any role="main" attribute as it's redundant on <section>
      newContent = newContent.replace(/\s*role\s*=\s*["']main["']/gi, '');
      
      // Apply the replacement
      content = content.substring(0, replacement.start) + newContent + content.substring(replacement.end);
      
      modified = true;
    }
    
    return modified ? content : null;
  } catch (error) {
    console.error(`Error processing main landmarks in ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Process a file based on its extension
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file was modified
 */
function processFile(filePath) {
  const ext = path.extname(filePath);
  
  // Handle TSX/JSX files
  if (ext === '.tsx' || ext === '.jsx') {
    let modified = false;
    
    // Process SVG elements for accessibility
    const newContent = processTsxFile(filePath);
    if (newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed SVG accessibility: ${filePath}`);
      modified = true;
    }
    
    // Process main landmarks for accessibility
    const mainContent = processMainLandmarks(filePath);
    if (mainContent) {
      fs.writeFileSync(filePath, mainContent, 'utf8');
      console.log(`Fixed REACT_025 (multiple main landmarks): ${filePath}`);
      modified = true;
    }
    
    return modified;
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
      const ext = path.extname(entry.name);
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
  processMainLandmarks,
  processDirectory
};