// main.js

import React from 'react';
import ReactDOM from 'react-dom';

// Utility function to render the main content of the application
const renderMainContent = (Component, props) => (
  <main {...props}>
    <Component />
  </main>
);

// Example usage of the utility function
const App = () => {
  // Component logic here
  // ...

  // Decide which component to render based on some logic
  const componentToRender = determineComponentToRender(); // This is a placeholder function

  return renderMainContent(componentToRender, { /* any props that might be needed */ });
};

ReactDOM.render(<App />, document.getElementById('root'));