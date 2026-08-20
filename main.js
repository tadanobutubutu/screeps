// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'scope' attribute to <th> elements that are missing it
const addScopeToTh = (htmlString) => {
  // Use regex to find <th> elements that don't have a scope attribute
  // and add scope="col" to them
  return htmlString.replace(/<th(\s[^>]*)?(?!\s+scope)[^>]*>/gi, (match, attributes) => {
    // Check if it's a self-closing tag or has content
    if (match.endsWith('/>')) {
      // Self-closing tag: <th />
      return match.replace('/>', ' scope="col"/>');
    }
    // Regular opening tag: <th>
    if (attributes) {
      return `<th${attributes} scope="col">`;
    }
    return '<th scope="col">';
  });
};

// Example usage of the new function to fix the issue in the given files
const fixDependencyGraph = () => {
  const fs = require('fs');
  const path = require('path');
  
  const dependencyGraphFile = path.join(__dirname, 'src', 'components', 'DependencyGraph.jsx');
  
  try {
    const content = fs.readFileSync(dependencyGraphFile, 'utf8');
    const updatedContent = addScopeToTh(content);
    fs.writeFileSync(dependencyGraphFile, updatedContent);
    console.log('Successfully added scope attribute to <th> elements');
  } catch (error) {
    console.error('Error fixing dependency graph:', error);
  }
};

// Ensure to call fixDependencyGraph() if needed to apply the fix
// ...

// Rest of the main.js code goes here
// ...