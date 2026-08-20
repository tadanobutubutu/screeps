import React from 'react';
import ReactDOM from 'react-dom/client';

// Root element with language attribute for accessibility
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Main Application</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>

// Example React component
const App = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
    </div>
  );
};

export default App;