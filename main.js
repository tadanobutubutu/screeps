// Assuming main.js is a JavaScript file that might be related to the HTML content
// Here is a sample structure of main.js, which might be relevant to the HTML content
// but is not directly solving the issue.

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Sample App component, which would be in your project
class App extends React.Component {
  render() {
    return (
      <div className="app">
        {/* The HTML content of docs/dependency-graph.html would be included here */}
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Dependency Graph</title>
          </head>
          <body>
            {/* Rest of the HTML content */}
          </body>
        </html>
      </div>
    );
  }
}