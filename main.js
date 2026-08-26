// Assuming main.js is a React component
import React from 'react';
import { getDependencyGraph } from './dependencyGraph'; // Add this import

function DependencyGraph() {
  // You can directly render the HTML string or fetch it from a server
  // For this example, I'll use a string for simplicity
  const htmlContent = getDependencyGraph(); // Use the newly imported function

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default DependencyGraph;

// Add the new function to render the dependency graph
const DepsGraphHTML = `
  <!-- The content of the dependency-graph.html goes here -->
  <!-- ... -->
`;

function getDependencyGraph() {
  // Perform the necessary logic to fetch or generate the dependency graph content
  // e.g., fetching from an API or generating based on the project's package.json file

  return DepsGraphHTML;
}