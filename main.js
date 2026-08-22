// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Application</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);