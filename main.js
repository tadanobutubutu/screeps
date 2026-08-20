// main.js

// Import necessary components or functions from your React app
import React from 'react';
import ReactDOM from 'react-dom';

// ... other imports and code ...

// Function to render the content of the page
function renderContent() {
  // ... existing code to render the content ...

  // Replace the anchor tag with a button for the 'rotate back' action
  const rotateBackLink = (
    <button id="unrotate" onClick={() => {/* Your action handler here */}}>rotate back</button>
  );

  // ... existing code to render the content ...
}

// Render the content to the DOM
ReactDOM.render(
  <React.StrictMode>
    {renderContent()}
  </React.StrictMode>,
  document.getElementById('root')
);

// ... other code ...