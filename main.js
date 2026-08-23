// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return <h1>Hello World</h1>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <html lang="en">
    <head>
      <title>My App</title>
    </head>
    <body>
      <App />
    </body>
  </html>
);