// Assuming main.js is a JavaScript file that imports and uses the HTML content from 'docs/dependency-graph.html'
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // This line is for illustrative purposes and would not be present in the actual JavaScript file

// This is a placeholder for the actual React component that would render the HTML content
const App = () => {
  return (
    <div>
      {/* Render the HTML content from 'docs/dependency-graph.html' */}
      {/* Note: The lang attribute is added here for the sake of the example */}
      <html lang="en">
        <head>
          <title>Dependency Graph</title>
        </head>
        <body>
          {/* The actual content of 'docs/dependency-graph.html' would go here */}
        </body>
      </html>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));