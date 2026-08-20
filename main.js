// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'scope' attribute to <th> elements that are missing it
const addScopeToTh = (htmlString) => {
  // Regex finds <th> tags that do NOT already contain a scope attribute
  // and injects scope="col" (suitable for table header cells)
  return htmlString.replace(/<th(?![^>]*\bscope=)([^>]*?)>/gi, (match, attributes) => {
    // Handle self‑closing <th /> tags
    if (attributes.trim().endsWith('/')) {
      return `<th scope="col"${attributes}>`;
    }
    // Handle regular opening <th> tags
    return `<th scope="col"${attributes}>`;
  });
};

// Scan a set of files and apply the fix where needed
const fixThScopeInFiles = () => {
  const fs = require('fs');
  const path = require('path');

  // List of files (or patterns) that should be checked/updated
  const targetFiles = [
    path.join(__dirname, 'src', 'components', 'DependencyGraph.jsx'),
    // Add additional file paths or globs as appropriate
  ];

  targetFiles.forEach(filePath => {
    try {
      const original = fs.readFileSync(filePath, 'utf8');
      const updated = addScopeToTh(original);
      if (updated !== original) {
        fs.writeFileSync(filePath, updated);
        console.log(`✅ Added missing scope attribute to <th> in ${filePath}`);
      }
    } catch (err) {
      console.error(`⚠️  Failed to process ${filePath}:`, err);
    }
  });
};

// Ensure the fix runs when this module is executed directly
if (require.main === module) {
  fixThScopeInFiles();
}

// Rest of the main.js code goes here
// ...