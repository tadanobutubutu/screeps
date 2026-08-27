// main.js

// ... existing code ...

// Importing necessary components and libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Component that needs the lang attribute
const MyComponent = () => {
  // ... component logic ...
  return (
    // ... JSX code ...
  );
};

// Rendering the component
ReactDOM.render(
  <MyComponent />,
  document.getElementById('root')
);

// ... additional code ...

// Adding the lang attribute to the root element
document.documentElement.lang = 'en';

// ... rest of the main.js file ...