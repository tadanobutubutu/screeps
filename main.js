import React from 'react';
import ReactDOM from 'react-dom/client';

// Fix: Added lang="en" to the root HTML element for accessibility
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Main Application</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

// Simple React component
const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>This is the main application.</p>
    </div>
  );
};

export default App;