// main.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

// This function renders the React app to an HTML string
export function renderToString(element) {
  return ReactDOMServer.renderToString(element);
}

// This function renders the complete HTML document with proper accessibility
export function renderToHtmlDocument(element, title = 'React App') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <div id="root">${ReactDOMServer.renderToString(element)}</div>
</body>
</html>`;
}

export default App;