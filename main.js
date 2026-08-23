import React from 'react';
import ReactDOM from 'react-dom';

// HTML template with the required lang attribute
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Screeps</title>
</head>
<body>
  <div id="root"></div>
  <script src="main.js"></script>
</body>
</html>`;

// Example React component
const App = () => (
  <div className="app">
    {/* App content */}
  </div>
);

// Render the app into the root div
ReactDOM.render(<App />, document.getElementById('root'));

export default App;