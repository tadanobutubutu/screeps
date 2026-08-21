import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inject the HTML document with lang attribute for accessibility
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;

document.open();
document.write(html);
document.close();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);