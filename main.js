import fs from 'fs';
import path from 'path';

// Function to update the <th> elements with the scope attribute
function updateTableHeaders(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/<th>/g, '<th scope="col">');
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  } catch (e) {
    // In environments where fs is not available (e.g., browsers), ignore
  }
}

// List of files that need to be updated
const filesToUpdate = [
  path.join(__dirname, 'docs/dependency-graph.html'),
  // Add other file paths here if needed
];

// Update each file
filesToUpdate.forEach(updateTableHeaders);

// Assuming that there is a component that renders the HTML file
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // Hypothetical import to include the HTML content

const App = () => {
  // ... other component logic ...

  return (
    <div>
      {/* Hypothetical component that renders the HTML file */}
      <DependencyGraphComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));