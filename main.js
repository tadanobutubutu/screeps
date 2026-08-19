// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'scope' attribute to <th> elements that are missing it
const addScopeToTh = (htmlString) => {
  return htmlString.replace(/<th>/g, '<th scope="col">');
};

// Function to replace hash-only links with proper buttons
const replaceFakeLinksWithButtons = (htmlString) => {
  return htmlString.replace(/<a\s+id="unrotate"\s+href="#">rotate back<\/a>/g,
    '<button id="unrotate" class="fake-link">rotate back</button>');
};

// Example usage of the new function to fix the issue in the given files
const fixDependencyGraph = () => {
  const dependencyGraphFile = 'docs/dependency-graph.html';
  const content = fs.readFileSync(dependencyGraphFile, 'utf8');
  const updatedContent = addScopeToTh(content);
  const finalContent = replaceFakeLinksWithButtons(updatedContent);
  fs.writeFileSync(dependencyGraphFile, finalContent);
};

// Ensure to call fixDependencyGraph() if needed to apply the fix
// fixDependencyGraph();

// Rest of the main.js code goes here
// ...