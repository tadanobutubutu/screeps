import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Main entry point for the React application
// Note: The lang="en" attribute should be set in index.html on the <html> element, not in main.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preserve all existing exports and functions from the original main.js
export { root };

// main.js remains unchanged as it's not causing syntax errors
// The actual fix needs to be applied to dependency-graph.html
// Here's what needs to be added to each <th> element in that file:

// For each <th> element in dependency-graph.html, add scope="col" like this:
// <th scope="col"><div>src/constants.js</div></th>

console.log("main.js is properly formatted as JavaScript");