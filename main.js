import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <h1>Dependency Graph</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export function renderPage() {
  return `
    <html lang="en">
      <head>
        <title>Dependency Graph</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
}