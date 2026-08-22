// Hypothetical imports, assuming these are the components that render the affected HTML files
import dependencyGraphHTML from './docs/dependency-graph.html';
import indexHTML from './docs/index.html';

// Hypothetical function that updates the HTML to include a <main> tag
function wrapContentWithMain(htmlContent) {
  return `<main>${htmlContent}</main>`;
}

// Updated components with the <main> tag wrapped around the primary content
export const updatedDependencyGraphHTML = wrapContentWithMain(dependencyGraphHTML);
export const updatedIndexHTML = wrapContentWithMain(indexHTML);