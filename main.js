import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './docs/dependency-graph.html'; // Assuming this is the way the HTML file is imported

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Update the HTML file content within the main.js file
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Graph</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

document.write(htmlContent);