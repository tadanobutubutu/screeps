// Assuming the following is the original content of main.js

// ... [existing code] ...

// Add the following at the end of main.js to wrap the primary content in <main> elements

const wrapPrimaryContentWithMain = (htmlContent) => {
  return htmlContent.replace(
    /<div class="container">/g,
    '<main><div class="container">'
  ).replace(
    /<\/div>/g,
    '</div></main>'
  );
};

// Update the content of the HTML files by wrapping the primary content in a <main> element
const updateDependencyGraphContent = () => {
  const dependencyGraphContent = require('../docs/dependency-graph.html');
  const updatedContent = wrapPrimaryContentWithMain(dependencyGraphContent);
  // Save the updated content back to the file or manipulate it as needed
};

const updateIndexContent = () => {
  const indexContent = require('../docs/index.html');
  const updatedContent = wrapPrimaryContentWithMain(indexContent);
  // Save the updated content back to the file or manipulate it as needed
};

// Call the functions to update the content of the affected files
updateDependencyGraphContent();
updateIndexContent();

// ... [remaining code] ...