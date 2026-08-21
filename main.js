// main.js

// Import any necessary components and styles
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming the primary content is wrapped in an App component

// Wrap the primary content in a <main> element
ReactDOM.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);