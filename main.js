// main.js
import React from 'react';

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

const App = () => {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <div id="root">
          <h1>Welcome to My App</h1>
          <p>This is an accessible React application.</p>
        </div>
      </body>
    </html>
  );
};

export default App;