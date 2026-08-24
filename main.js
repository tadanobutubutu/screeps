// Assuming renderTemplate is a method that takes a template string and renders it
// to the DOM or returns the rendered HTML string.

// Import the templates or get the template strings
const dependencyGraphTemplate = require('./templates/dependency-graph');
const indexTemplate = require('./templates/index');

// Function to wrap the primary content in a <main> tag
function wrapInMain(template) {
  return `<main>${template}</main>`;
}

// Update the templates to include the <main> tag
const updatedDependencyGraphTemplate = wrapInMain(dependencyGraphTemplate);
const updatedIndexTemplate = wrapInMain(indexTemplate);

// Render the updated templates
// Assuming there is a method renderTemplate that takes a template string
renderTemplate(updatedDependencyGraphTemplate);
renderTemplate(updatedIndexTemplate);