import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function renderUrl(url) {
  // Fix: Add lang="en" to the HTML document
  const html = renderToString(<App />);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <div id="root">${html}</div>
</body>
</html>`;
}