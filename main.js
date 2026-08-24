// Assuming we are unifying the TypeScript React component (Dashboard) with the JavaScript file for HTML generation

// Import dependencies
import React from 'react';
import { generateIndexHtml, generateDependencyGraphHtml } from '.'; // Importing functions for HTML generation

// Function to wrap the primary content in a <main> element
function wrapContentInMain(content) {
  return `<main>${content}</main>`;
}

// TypeScript React component for the Dashboard
const Dashboard = ({ error, success }) => {
  const indexHtml = generateIndexHtml(); // Generate the HTML content for the index page
  const dependencyGraphHtml = generateDependencyGraphHtml(); // Generate the HTML content for the dependency graph page

  // Determine the appropriate page based on error and success props
  const primaryContent = error && indexHtml || success && dependencyGraphHtml;

  return (
    <div>
      {primaryContent && (
        // Wrap the primary content in a <main> element
        wrapContentInMain(primaryContent)
      )}
      {!error && !success && (
        // Other content that should be in the main area of the page
        <main>
          <!-- Other content that should be in the main area of the page -->
        </main>
      )}
    </div>
  );
};

// Export the updated Dashboard component
export default Dashboard;