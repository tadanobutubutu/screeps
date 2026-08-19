// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'scope' attribute to <th> elements that are missing it
const addScopeToTh = (htmlString) => {
  return htmlString.replace(/<th>/g, '<th scope="col">');
};

// Function to add language attribute to html element
const addLangAttribute = (htmlString) => {
  return htmlString.replace(/<html>/g, '<html lang="en">');
};

// Example usage of the new function to fix the issue in the given files
const fixDependencyGraph = () => {
  const dependencyGraphFile = 'docs/dependency-graph.html';
  const content = fs.readFileSync(dependencyGraphFile, 'utf8');
  const updatedContent = addScopeToTh(addLangAttribute(content));
  fs.writeFileSync(dependencyGraphFile, updatedContent);
};

// Ensure to call fixDependencyGraph() if needed to apply the fix
// fixDependencyGraph();

// Rest of the main.js code goes here
// ...