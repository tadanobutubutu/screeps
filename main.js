// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'lang' attribute to the <html> element that is missing it
const addLangAttribute = (htmlString) => {
  // Check if the <html> element has the lang attribute
  if (!/<html\b[^>]*>/i.test(htmlString)) {
    return htmlString;
  }

  // If the <html> element does not have the lang attribute, add it
  return htmlString.replace(/<html\b[^>]*>/i, '<html lang="en">');
};

// Example usage of the new function to fix the issue in the given files
const fixDependencyGraph = () => {
  const fs = require('fs');
  const path = require('path');
  
  const dependencyGraphFile = path.join(__dirname, 'docs', 'dependency-graph.html');
  
  try {
    const content = fs.readFileSync(dependencyGraphFile, 'utf8');
    const updatedContent = addLangAttribute(content);
    fs.writeFileSync(dependencyGraphFile, updatedContent);
    console.log('Successfully added lang attribute to <html> element');
  } catch (error) {
    console.error('Error fixing dependency graph:', error);
  }
};

// Ensure to call fixDependencyGraph() if needed to apply the fix
// fixDependencyGraph();

// Rest of the main.js code goes here
// ...